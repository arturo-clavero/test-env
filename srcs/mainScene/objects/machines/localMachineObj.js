import { Object } from '../../../core/objectFactory/Object'
import { materialsgroup, singleMaterial, 
		part_sym_2d, part_sym_3d, 
		part_asym, part_asym_ang,
		threeCube} from '../simpleAssets';

const obj1 = new Object(part_sym_2d);
obj1.self.position.z = 3;
obj1.self.position.x = -4;
obj1.self.position.y = 2;

const localMachineObj = obj1;
const screenSurface = obj1.basePart.shapes[0];
const center = obj1.self.position.clone();
center.z += 2;
export {localMachineObj, screenSurface, center}