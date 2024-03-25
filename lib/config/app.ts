import * as express from "express";
import * as bodyParser from "body-parser";
import * as mongoose from 'mongoose';
import * as cors from 'cors';
import environment from "../environment";
import { TestRoutes } from "../routes/test_routes";
import { UserRoutes } from "../routes/user_routes";
import { CommonRoutes } from "../routes/common_routes";
import { PostRoutes } from "../routes/post_routes";
import { ReviewRoutes } from "../routes/review_routes";


class App {

   public app: express.Application;
   public mongoUrl: string = 'mongodb://localhost/' + environment.getDBName();

   private test_routes: TestRoutes = new TestRoutes();
   private common_routes: CommonRoutes = new CommonRoutes();
   private user_routes: UserRoutes = new UserRoutes();
   private post_routes: PostRoutes = new PostRoutes();
   private review_routes: ReviewRoutes = new ReviewRoutes();

   constructor() {
      this.app = express();
      this.config();
      this.mongoSetup();
      this.test_routes.route(this.app);
      this.user_routes.route(this.app);
      this.post_routes.route(this.app);
      this.review_routes.route(this.app);
      this.common_routes.route(this.app);
      
   }

   private config(): void {
      // support application/json type post data
      this.app.use(bodyParser.json());
      //support application/x-www-form-urlencoded post data
      this.app.use(bodyParser.urlencoded({ extended: false }));
      // Enable CORS for all origins
      this.app.use(cors());
   }

   private mongoSetup(): void {
      mongoose.connect(this.mongoUrl)
          .then(() => {
              console.log("MongoDB connected successfully.");
          })
          .catch((err) => {
              console.error("MongoDB connection error:", err);
          });
  }
}
export default new App().app;