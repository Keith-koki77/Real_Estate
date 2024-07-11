import { PrismaClient } from '@prisma/client';
import { validateListingInput } from '../utils/validators.js';

const prisma = new PrismaClient();

export const createListing = async (req, res) => {
  try {
    const { address, coordinates, createdById } = req.body;
    
    const validationError = validateListingInput(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const listing = await prisma.listing.create({
      data: {
        address,
        coordinates,
        createdById
      }
    });

    res.status(201).json(listing);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create listing' });
  }
};

export const getListings = async (req, res) => {
  try {
    const listings = await prisma.listing.findMany();
    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
};

export const getListing = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await prisma.listing.findUnique({
      where: { id }
    });

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    res.json(listing);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch listing' });
  }
};

export const updateListing = async (req, res) => {
  try {
    const { id } = req.params;
    const { address, coordinates } = req.body;

    const validationError = validateListingInput(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const updatedListing = await prisma.listing.update({
      where: { id },
      data: { address, coordinates }
    });

    res.json(updatedListing);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update listing' });
  }
};

export const deleteListing = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.listing.delete({
      where: { id }
    });

    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete listing' });
  }
};