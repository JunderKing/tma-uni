import {
	createSSRApp
} from "vue";
import App from "./App.vue";
import eruda from 'eruda'

eruda.init()

export function createApp() {
	const app = createSSRApp(App);
	return {
		app,
	};
}
