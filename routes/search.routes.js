const express=require("express")
const searchController=require("../controllers/search.controller")
const router=express.Router()


router.get("/search-items" ,  searchController.searchItem)
router.get("/search-brand" , searchController.searchBrand)
router.get("/search-model" , searchController.searchModel)


module.exports=router