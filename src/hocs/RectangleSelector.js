import { getCoordPercentage } from '../utils/offsetCoordinates';

export const TYPE = 'RECTANGLE';

export function intersects({ x, y }, geometry) {
  let flag = true;
  if (x < geometry.x) flag = false;
  if (y < geometry.y) flag = false;
  if (x > geometry.x + geometry.width) flag = false;
  // @ts-ignore
  if (y > geometry.y + geometry.height) flag = false;

  return flag;
}

export function area(geometry) {
  return geometry.height * geometry.width;
}

function pointerDown(annotation, e) {
  if (!annotation.selection) {
    const { x: anchorX, y: anchorY } = getCoordPercentage(e);
    return {
      ...annotation,
      selection: {
        ...annotation.selection,
        mode: 'SELECTING',
        anchorX,
        anchorY
      }
    };
  } else {
    return {};
  }
}

function pointerUp(annotation) {
  if (annotation.selection) {
    const { geometry } = annotation;
    if (!geometry) {
      return {};
    }

    // eslint-disable-next-line
    switch (annotation.selection.mode) {
      case 'SELECTING':
        return {
          ...annotation,
          selection: {
            ...annotation.selection,
            showEditor: true,
            mode: 'EDITING'
          }
        };
      default:
        break;
    }
  }
  return annotation;
}

function pointerMove(annotation, e) {
  if (annotation.selection && annotation.selection.mode === 'SELECTING') {
    const { anchorX, anchorY } = annotation.selection;
    const { x: newX, y: newY } = getCoordPercentage(e);
    const width = newX - anchorX;
    const height = newY - anchorY;

    return {
      ...annotation,
      geometry: {
        ...annotation.geometry,
        type: TYPE,
        x: width > 0 ? anchorX : newX,
        y: height > 0 ? anchorY : newY,
        width: Math.abs(width),
        height: Math.abs(height)
      }
    };
  }
  return annotation;
}

export const methods = {
  onTouchStart(annotation, e) {
    return pointerDown(annotation, e);
  },
  onTouchEnd(annotation) {
    return pointerUp(annotation);
  },
  onTouchMove(annotation, e) {
    return pointerMove(annotation, e);
  },
  onMouseDown(annotation, e) {
    return pointerDown(annotation, e);
  },
  onMouseUp(annotation) {
    return pointerUp(annotation);
  },
  onMouseMove(annotation, e) {
    return pointerMove(annotation, e);
  }
};

export default {
  TYPE,
  intersects,
  area,
  methods
};
