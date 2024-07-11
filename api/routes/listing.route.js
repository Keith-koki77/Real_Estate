import express from 'express';
import { createListing, getListings, getListing, updateListing, deleteListing } from './listing.controller.js';
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post('/', verifyToken, createListing);
router.get('/', getListings);
router.get('/:id', getListing);
router.put('/:id', verifyToken, updateListing);
router.delete('/:id', verifyToken, deleteListing);

export default router;