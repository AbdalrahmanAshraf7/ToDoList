import express from 'express';
import cors from "cors";
require("dotenv").config();
const app = express();
const PORT = 5000;
app.use(express.json());
app.use(cors());
app.listen(PORT, () => console.log(`SV is working on ${PORT}`));
//# sourceMappingURL=index.js.map