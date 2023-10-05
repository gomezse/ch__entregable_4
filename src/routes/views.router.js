import { Router } from "express";
import { manager } from "../ProductManager.js";
const router = Router();


router.get(`/home`, async (req, res) => {
    const products = await manager.getProducts(req.query);
    res.render("home",{products,style:'index'});

});
router.get(`/`, async (req, res) => {
  const products = await manager.getProducts(req.query);
  res.render("home",{products,style:'index'});

});
router.get(`/realtimeproducts`, async (req, res) => {
  const products = await manager.getProducts(req.query);
  res.render("realTimeProducts",{products,style:'index'});

});


export default router;
