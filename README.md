# Inventory Management Backend API

This document describes the available backend API routes, request parameters, and response formats for the Inventory Management application.

## Base URL

Assuming the backend runs locally on port `5000`:

`http://localhost:5000`

> Adjust the host/port based on your actual runtime environment.

---

## Common Response Structure

Successful responses generally return JSON in one of these shapes:

- `200 OK` or `201 Created`
  - `{ message: string, data: any }`
  - `{ message: string, data: any, hasMore: boolean, total: number }`

Error responses generally return JSON in this shape:

- `{ message: string, error?: string }`

---

## Brand Routes

### Create Brand

- `POST /brand/Upload-Brand`
- Request body:
  - `name` (string, required)
  - `categoryId` (string, required)
- Success response:
  - Status: `201`
  - Body: `{ message: "Brand Successfully created", data: brand }`
- Error cases:
  - `404` when `name`, `categoryId` is missing, or category does not exist
  - `400` when brand already exists
  - `500` on server error

### Get All Brands

- `GET /brand/Get-All-Brands`
- Query params:
  - `page` (number, optional, default `1`)
  - `limit` (number, optional, default `10`)
- Success response:
  - Status: `200`
  - Body: `{ message: "Brands Fetched Successfully", data: brands, hasMore: boolean, total: number }`

### Get Brands by Category

- `GET /brand/Get-brand-By-Category`
- Query params:
  - `id` (string, required) — category id
  - `page` (number, optional, default `1`)
  - `limit` (number, optional, default `10`)
- Success response:
  - Status: `200`
  - Body: `{ message: "Brands Fetched Successfully", data: brands, hasMore: boolean }`
- Error cases:
  - `404` when `id` is missing or category is invalid

### Delete Brand

- `DELETE /brand/Delete-Brand/:id`
- Path params:
  - `id` (string, required) — brand id
- Success response:
  - Status: `200`
  - Body: `{ message: "Brand deleted successfully", data: deletedBrand }`
- Error cases:
  - `404` when `id` is missing or brand is invalid

---

## Category Routes

### Create Category

- `POST /category/Upload`
- Request body:
  - `name` (string, required)
- Success response:
  - Status: `201`
  - Body: `{ message: "Category Upload Successfully", data: category }`
- Error cases:
  - `404` when `name` is missing
  - `400` when a category with the same name already exists

### Get All Categories

- `GET /category/Get-All-Categories`
- Query params:
  - `page` (number, optional, default `1`)
  - `limit` (number, optional, default `10`)
- Success response:
  - Status: `200`
  - Body: `{ message: "Categories fetched successfully", data: categories, hasMore: boolean, total: number }`

### Delete Category

- `DELETE /category/Delete-Category/:id`
- Path params:
  - `id` (string, required) — category id
- Success response:
  - Status: `200`
  - Body: `{ message: "Category deleted successfully", data: deletedCategory }`
- Notes:
  - This route also deletes items associated with the category before deleting the category.
- Error cases:
  - `400` when `id` is missing
  - `404` when category does not exist

---

## Item Routes

### Add Item

- `POST /items/Add-item`
- Request body:
  - `name` (string, required)
  - `category` (string, required) — category id
  - `price` (number, required)
  - `model` (string, required) — model id
  - `brand` (string, required) — brand id
  - `stock` (number, required)
- Success response:
  - Status: `201`
  - Body: `{ message: "Item Added Successfully", data: item }`
- Error cases:
  - `404` when required fields are missing or related entities are invalid
  - `400` when `price` or `stock` is invalid, or item already exists

### Get All Items

- `GET /items/Get-All-Items`
- Query params:
  - `page` (number, optional, default `1`)
  - `limit` (number, optional, default `10`)
- Success response:
  - Status: `200`
  - Body: `{ message: "Items Fetched Successfully", data: items, hasMore: boolean, total: number }`

### Get Item by ID

- `GET /items/Get-Item/:id`
- Path params:
  - `id` (string, required) — item id
- Success response:
  - Status: `200`
  - Body: `{ message: "Item Fetched Successfully", data: item }`
  - The returned `item` includes `category`, `brand`, and `itemModel` relations.
- Error cases:
  - `404` when `id` is missing or item does not exist

### Update Item

- `PUT /items/Update-Item/:id`
- Path params:
  - `id` (string, required) — item id
- Request body fields (all optional if you want to partially update):
  - `name` (string)
  - `category` (string) — category id
  - `price` (number)
  - `model` (string) — model id
  - `brand` (string) — brand id
  - `stock` (number)
  - `categoryName` (string)
  - `brandName` (string)
  - `modelName` (string)
- Success response:
  - Status: `200`
  - Body: `{ message: "Item Updated Successfully", data: updatedItem }`
- Error cases:
  - `404` when `id` is missing or item does not exist

### Delete Item

- `DELETE /items/Delete-Item/:id`
- Path params:
  - `id` (string, required) — item id
- Success response:
  - Status: `200`
  - Body: `{ message: "Item deleted successfully", data: deletedItem }`
- Error cases:
  - `400` when `id` is missing
  - `404` when item does not exist

---

## Model Routes

### Create Model

- `POST /model/Create-Model`
- Request body:
  - `name` (string, required)
  - `brandId` (string, required)
- Success response:
  - Status: `201`
  - Body: `{ message: "Model Created Successfully", data: model }`
- Error cases:
  - `404` when required fields are missing or brand is invalid
  - `400` when the model already exists for the brand

### Get All Models

- `GET /model/Get-All-Models`
- Query params:
  - `page` (number, required)
  - `limit` (number, required)
- Success response:
  - Status: `201`
  - Body: `{ message: "Brand Models are fetched successfully", data: models, hasMore: boolean, total: number }`

### Get Models by Brand

- `GET /model/Get-Model-By-Brand`
- Query params:
  - `id` (string, required) — brand id
  - `page` (number, optional, default `1`)
  - `limit` (number, optional, default `10`)
- Success response:
  - Status: `200`
  - Body: `{ message: "Models Fetched Successfully", data: models, hasMore: boolean }`
- Error cases:
  - `404` when `id` is missing or brand does not exist

### Delete Model

- `DELETE /model/Delete-Model/:id`
- Path params:
  - `id` (string, required) — model id
- Success response:
  - Status: `200`
  - Body: `{ message: "Model Deleted Successfully", data: deletedModel }`
- Notes:
  - This route also deletes items associated with that model before deleting the model.
- Error cases:
  - `404` when `id` is missing or model does not exist

---

## Search Routes

### Search Items

- `GET /search/search-items`
- Query params:
  - `name` (string, optional)
  - `minPrice` (number, optional)
  - `maxPrice` (number, optional)
- Success response:
  - Status: `200`
  - Body: `{ message: "Items fetched Successfully", data: items }`
- Error cases:
  - `400` when `name` is shorter than 2 characters
  - `400` when `minPrice` or `maxPrice` is `<= 0`
  - `400` when `minPrice` is greater than `maxPrice`

---

## Root Route

- `GET /`
- Success response:
  - `200 OK`
  - Body: `Backend is working`
