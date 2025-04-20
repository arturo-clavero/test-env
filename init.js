import { preEnterScene } from "./src/index.js";
import { OnLoad } from "./src/mainScene/utils/OnLoad.js";


//uponEnter()
// export function onMounted(){
	const value = "fake"
	const container = document.getElementById('app-container');
	preEnterScene(container);
	new OnLoad().set_first_load(value)
// }


// // App.vue
// import { preEnterScene, uponEnter } from "./src/index.js";

// onMounted(() => {
// 	const container = document.getElementById('app-container');
// 	preEnterScene(container);
// new OnLoad().set_first_load(showMainApp.value)
//   });
// });