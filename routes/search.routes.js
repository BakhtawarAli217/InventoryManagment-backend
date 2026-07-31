const express=require("express")
const searchController=require("../controllers/search.controller")
const router=express.Router()
const userAuth=require("../middlewares/userAuth.middleware")


router.get("/search-items" , userAuth.authUser ,  searchController.searchItem)
router.get("/search-brand" , userAuth.authUser , searchController.searchBrand)
router.get("/search-model" , userAuth.authUser , searchController.searchModel)
router.get("/search-category" , userAuth.authUser , searchController.searchCategory)
router.get("/search-order" , userAuth.authUser , searchController.searchOrder)


module.exports=router