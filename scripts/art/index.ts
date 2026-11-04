/** Mọi hình KidCamp tự vẽ, theo tên (khóa asset là `art-<tên>`). */
import { actionArt } from "./actions";
import { describeArt } from "./describe";
import { placesArt } from "./places";
import { schoolArt } from "./school";

export const art: Record<string, () => string> = { ...actionArt, ...schoolArt, ...describeArt, ...placesArt };
