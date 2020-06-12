import {ViewComponent} from "./component/view.component.js";
import {SearchComponent} from "./component/search.component.js";
import {ApiComponent} from "./component/api.component.js";
import {LogComponent} from "./component/log.component.js";

const api = new ApiComponent()

const app = new SearchComponent(new ViewComponent(api), api, new LogComponent());
