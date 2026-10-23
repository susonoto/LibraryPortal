import Resource from '../models/Resource.js';
import Website from '../models/Website.js';

export const getResources = async (req, res) => {
  try {
    const resources = await Resource.find().sort({ isFeatured: -1, title: 1 });
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createResource = async (req, res) => {
  try {
    const resource = await Resource.create(req.body);
    res.status(201).json(resource);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getWebsites = async (req, res) => {
  try {
    const websites = await Website.find({ isActive: true }).sort({ category: 1, name: 1 });
    res.json(websites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createWebsite = async (req, res) => {
  try {
    const website = await Website.create(req.body);
    res.status(201).json(website);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
