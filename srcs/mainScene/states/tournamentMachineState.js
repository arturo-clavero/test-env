
import { State } from '../../core/stateManager/States';
import { MeshSubState , CssSubState} from '../../core/stateManager/SubStatesExtends';

import { screenMaterial } from '../objects/simpleAssets';
import { screenSurface, center, object, partIndex, surfaceIndex } from '../objects/machines/tournamentMachineObj';
import { scene1 } from '../overlays/scenes/scene1';
import { fakeGame } from '../overlays/scenes/fakeGame';
import { End } from '../overlays/divs/end';
import {start} from '../overlays/divs/tour_create';
import {join} from '../overlays/divs/tour_join';

const divStart = start;
const restScreenCreate = new CssSubState(
	"rest create",
	object,
	partIndex,
	surfaceIndex,
	divStart["div"],
	0,
	()=>{
		console.log("pre enter create")
		divStart['show-div']();
		divStart['hide-buttons']();
	},
	null,
	()=>{console.log("exit");},
	()=>{divStart["resize"]()},
	null,
	null,
)

const startScreenCreate = new CssSubState(
	"start create",
	object,
	partIndex,
	surfaceIndex,
	divStart['div'],
	0,
	null,
	()=>{
		divStart['show-div']();
		divStart['show-buttons']();
		console.log("enter create p2");
	},
	()=>{
		divStart['hide-div']();
		divStart['hide-buttons']();
		console.log("exit create p2");
	},
	()=>{divStart["resize"]()},
	null,
	null,
)

const divJoin = join;
const restScreenJoin = new CssSubState(
	"rest join",
	object,
	partIndex,
	surfaceIndex,
	divJoin["div"],
	0,
	()=>{
		console.log("pre enter join");
		divJoin['show-div']();
		divJoin['hide-buttons']();
	},
	null,
	()=>{
		console.log("exit join");
	},
	()=>{divJoin["resize"]()},
	null,
	null,
)

const startScreenJoin = new CssSubState(
	"start join",
	object,
	partIndex,
	surfaceIndex,
	divJoin['div'],
	0,
	null,
	()=>{
		console.log("enter join p2");
		divJoin['show-div']();
		divJoin['show-buttons']();
	},
	()=>{
		divJoin['hide-div']();
		divJoin['hide-buttons']();
		console.log("exit join p2");
	},
	()=>{divJoin["resize"]()},
	null,
	null,
)


const fakeGameScreen = new MeshSubState(
	"rest", 
	screenSurface,
	fakeGame,
	2,
	null,
	null,
	null,
	null,
	(event)=> { return divForm.keyHandler(event);},
)

const divEnd = new End();
const endScreen = new CssSubState(
	"end", 
	object,
	partIndex,
	surfaceIndex,
	divEnd.div,
	0,
	()=>{divEnd.enter()},
	null,
	()=>{divEnd.exit()},
	()=>{divEnd.resize()},
	(event)=> { return divEnd.keyHandler(event);},
	()=>{divEnd.animate()},
)

const tourMachineState = new State(
	"tour game screen", 
	{
		pos: [center.x,center.y,center.z],
		duration: 2,
		ease: "power2.inOut"
	}, 
	[
		restScreenCreate,
		startScreenCreate,
		restScreenJoin,
		startScreenJoin, 
		// matchesScreen,
		// gameScreen,
		// endScreen,
		// endScreen,
	],
	[
		// {"substate" : restScreen, "index" : 0},
		// {"substate" : startScreen, "index" : 1},
	],
	(self)=>{
		if (self.currentSubstateIndex == 0)
			self.changeSubstate();
	},
	(self)=>{
		if (self.currentSubstateIndex != 2)
		{
			self.currentSubstate.exit();
			self.changeSubstate(0);
		}
	},
	[
		screenMaterial,
		scene1.renderMaterial,
		fakeGame.renderMaterial,
	],

)

export { tourMachineState}