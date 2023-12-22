import passport from "passport";
import { generalResponse } from "../../utils/helper/comman.helper";
export const adminAuth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err) {
      return next(err);
    } else if (!user) {
      return generalResponse(
        res,
        { error: null },
        "your token is expired ",
        "error",
        true,
        403
      );
    } else {
      req.user = user;
      next();
    }
  })(req, res, next);
};
