const fs = require("fs");
const path = require("path");

const deleteFile = (filePath) => {
  if (!filePath) return;
  let absolutePath = filePath;
  if (filePath.startsWith("/uploads/") || filePath.startsWith("uploads/")) {
    const filename = filePath.replace(/^\/?uploads\//, "");
    absolutePath = path.join(__dirname, "../Uploads", filename);
  }

  if (fs.existsSync(absolutePath)) {
    try {
      fs.unlinkSync(absolutePath);
      console.log(`Deleted file: ${absolutePath}`);
    } catch (err) {
      console.error(`Error deleting file: ${absolutePath}`, err);
    }
  }
};

const getModelCRUD = (Model, fileFieldName = null) => {
  return {
    getAll: async (req, res) => {
      try {
        const items = await Model.find().sort({ createdAt: -1 });
        return res
          .status(200)
          .json({ success: true, count: items.length, data: items });
      } catch (err) {
        console.error(`Generic CRUD getAll Error for ${Model.modelName}:`, err);
        return res.status(550).json({
          success: false,
          message: "Unable to retrieve items. Please try again later.",
        });
      }
    },

    getOne: async (req, res) => {
      try {
        const item = await Model.findById(req.params.id);
        if (!item) {
          return res
            .status(404)
            .json({ success: false, message: "Resource not found" });
        }
        return res.status(200).json({ success: true, data: item });
      } catch (err) {
        console.error(`Generic CRUD getOne Error for ${Model.modelName}:`, err);
        return res.status(500).json({
          success: false,
          message: "Unable to retrieve details. Please try again later.",
        });
      }
    },

    create: async (req, res) => {
      try {
        const data = { ...req.body };

        for (const key in data) {
          if (typeof data[key] === "string") {
            const isArrayPath = Model.schema && Model.schema.paths[key] && (
              Model.schema.paths[key].instance === "Array" ||
              Model.schema.paths[key].constructor.name === "SchemaArray" ||
              Model.schema.paths[key].constructor.name === "Array"
            );
            if (isArrayPath) {
              try {
                data[key] = data[key] === "" ? [] : JSON.parse(data[key]);
              } catch (e) {
                // Keep as string
              }
            }
          }
        }

        if (req.file && fileFieldName) {
          data[fileFieldName] = `/uploads/${req.file.filename}`;
        }
        const item = await Model.create(data);
        return res.status(201).json({ success: true, data: item });
      } catch (err) {
        console.error(`Generic CRUD create Error for ${Model.modelName}:`, err);
        return res.status(400).json({
          success: false,
          message:
            "Unable to save details. Please check inputs and try again.",
        });
      }
    },

    update: async (req, res) => {
      try {
        const item = await Model.findById(req.params.id);
        if (!item) {
          return res
            .status(404)
            .json({ success: false, message: "Resource not found" });
        }

        const data = { ...req.body };

        for (const key in data) {
          if (typeof data[key] === "string") {
            const isArrayPath = Model.schema && Model.schema.paths[key] && (
              Model.schema.paths[key].instance === "Array" ||
              Model.schema.paths[key].constructor.name === "SchemaArray" ||
              Model.schema.paths[key].constructor.name === "Array"
            );
            if (isArrayPath) {
              try {
                data[key] = data[key] === "" ? [] : JSON.parse(data[key]);
              } catch (e) {
                // Keep as string
              }
            }
          }
        }

        if (req.file && fileFieldName) {
          if (item[fileFieldName]) {
            deleteFile(item[fileFieldName]);
          }
          data[fileFieldName] = `/uploads/${req.file.filename}`;
        }

        const updatedItem = await Model.findByIdAndUpdate(req.params.id, data, {
          new: true,
          runValidators: true,
        });

        return res.status(200).json({ success: true, data: updatedItem });
      } catch (err) {
        console.error(`Generic CRUD update Error for ${Model.modelName}:`, err);
        return res.status(400).json({
          success: false,
          message:
            "Unable to update details. Please check inputs and try again.",
        });
      }
    },

    delete: async (req, res) => {
      try {
        const item = await Model.findById(req.params.id);
        if (!item) {
          return res
            .status(404)
            .json({ success: false, message: "Resource not found" });
        }

        if (fileFieldName && item[fileFieldName]) {
          deleteFile(item[fileFieldName]);
        }

        await item.deleteOne();
        return res
          .status(200)
          .json({ success: true, message: "Resource deleted successfully" });
      } catch (err) {
        console.error(`Generic CRUD delete Error for ${Model.modelName}:`, err);
        return res.status(500).json({
          success: false,
          message: "Unable to delete item. Please try again later.",
        });
      }
    },
  };
};

module.exports = { getModelCRUD, deleteFile };
