
const Url = require('../models/Url');
const { nanoid } = require('nanoid');
const { Log } = require('../../LoggingMiddleware/log');
const validateUrl = require('../utils/validateUrl');

exports.createShortUrl = async (req, res) => {
  try {
    const { url, validity = 30, shortcode } = req.body;
    if (!validateUrl(url)) {
      Log("backend", "error", "handler", "Invalid URL format");
      return res.status(400).json({ error: "Invalid URL" });
    }
    const code = shortcode || nanoid(6);
    const existing = await Url.findOne({ shortcode: code });
    if (existing) {
      Log("backend", "warn", "handler", "Shortcode already exists");
      return res.status(409).json({ error: "Shortcode already exists" });
    }
    const expiry = new Date(Date.now() + validity * 60000);
    const newUrl = new Url({ originalUrl: url, shortcode: code, expiry });
    await newUrl.save();
    Log("backend", "info", "controller", `Created short URL: ${code}`);
    return res.status(201).json({
      shortLink: `${process.env.HOST}/${code}`,
      expiry: expiry.toISOString()
    });
  } catch (err) {
    Log("backend", "fatal", "db", "Database error in createShortUrl");
    res.status(500).json({ error: "Server error" });
  }
};
exports.redirectShortUrl = async (req, res) => {
  try {
    const code = req.params.shortcode;
    const urlDoc = await Url.findOne({ shortcode: code });

    if (!urlDoc) {
      Log("backend", "error", "controller", "Shortcode not found");
      return res.status(404).json({ error: "Shortcode not found" });
    }

    if (urlDoc.expiry < new Date()) {
      Log("backend", "warn", "controller", "Link expired");
      return res.status(410).json({ error: "Link expired" });
    }

    urlDoc.clicks.push({
      referrer: req.get("Referrer") || "unknown",
      location: req.ip
    });
    urlDoc.clickCount += 1;
    await urlDoc.save();

    Log("backend", "info", "controller", `Redirecting: ${code}`);
    return res.redirect(urlDoc.originalUrl);

  } catch (err) {
    Log("backend", "fatal", "db", "Database error in redirect");
    res.status(500).json({ error: "Server error" });
  }
};

exports.getStats = async (req, res) => {
  try {
    const code = req.params.shortcode;
    const urlDoc = await Url.findOne({ shortcode: code });

    if (!urlDoc) {
      Log("backend", "error", "controller", "Stats for shortcode not found");
      return res.status(404).json({ error: "Not found" });
    }

    return res.status(200).json({
      originalUrl: urlDoc.originalUrl,
      createdAt: urlDoc.createdAt,
      expiry: urlDoc.expiry,
      clickCount: urlDoc.clickCount,
      clickDetails: urlDoc.clicks
    });

  } catch (err) {
    Log("backend", "fatal", "db", "Error fetching stats");
    res.status(500).json({ error: "Server error" });
  }
};
