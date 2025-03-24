import { Object } from '../../../core/objectFactory/Object'
import { materialsgroup, singleMaterial, 
		part_sym_2d, part_sym_3d, 
		part_asym, part_asym_ang,
		threeCube} from '../simpleAssets';
import { StateManager } from '../../../core/stateManager/StateManager';
import { screenMaterial } from '../simpleAssets';

const obj1 = new Object(part_sym_2d);
obj1.self.position.z = 3;
obj1.self.position.x = 0;
obj1.self.position.y = 2;

const aiMachineObj = obj1;
aiMachineObj.add_onclick(()=>{ new StateManager().changeState(2);})

const screenSurface = obj1.basePart.shapes[0];
screenSurface.add_material( screenMaterial);
const center = obj1.self.position.clone();
center.z += 2;
export {aiMachineObj, screenSurface, center}