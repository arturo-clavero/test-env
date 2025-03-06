import * as THREE from 'three';

function order_path(points){
	let start = [-100, 100];
	let start_index;
	for (let i = 0; i < points.length; i++)
	{
		if (points[i][1] <= start[1] && points[i][0] > start[0])
		{
			start[0] = points[i][0];
			start[1] = points[i][1];
			start_index = i;
		}
	}
	const ordered = [];
	const next = start_index + 1 < points.length ? points[start_index + 1] : points[0];
	const prev = start_index - 1 > 0 ? points[start_index - 1] : points[points.length - 1];
	if (next[0] > prev[0]) 
	{
		let max = points.length;
		for (let i = start_index; i < max; i++){
			ordered.push(points[i]);
			if (i + 1 == points.length)
			{
				max = start_index;
				i = -1;
			}
		}
	}
	else {
		let max = -1;
		for (let i = start_index; i > max; i--){
			ordered.push(points[i]);
			if (i - 1 < 0)
			{
				max = start_index;
				i = points.length;
			}
		}
	}
	return ordered;
}

export { order_path };