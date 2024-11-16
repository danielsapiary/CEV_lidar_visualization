import React from 'react';

const LidarVisualization = ({ scanData, maxConsecutivePoints = 5, overlapPoints = 2 }) => {
  const { angle_increment, ranges } = scanData;

  const maxDistance = 10;
  const minDistance = 0.5;

  const polarToCartesian = (theta, distance) => {
    const x = distance * Math.cos(theta);
    const y = distance * Math.sin(theta);
    return { x, y };
  };

  const interpolateMissingData = (ranges) => {
    const interpolatedRanges = [...ranges];
    for (let i = 0; i < ranges.length; i++) {
      if (ranges[i] < minDistance || !isFinite(ranges[i])) {
        // Find nearest valid neighbors
        let prev = i - 1;
        while (prev >= 0 && (ranges[prev] < minDistance || !isFinite(ranges[prev]))) prev--;
        let next = i + 1;
        while (next < ranges.length && (ranges[next] < minDistance || !isFinite(ranges[next]))) next++;

        if (prev >= 0 && next < ranges.length) {
          // Average the distances of the neighbors
          interpolatedRanges[i] = (ranges[prev] + ranges[next]) / 2;
        } else if (prev >= 0) {
          // Use the previous valid point
          interpolatedRanges[i] = ranges[prev];
        } else if (next < ranges.length) {
          // Use the next valid point
          interpolatedRanges[i] = ranges[next];
        } else {
          // Default to maxDistance if no neighbors are valid
          interpolatedRanges[i] = maxDistance;
        }
      }
    }
    return interpolatedRanges;
  };

  const interpolatedRanges = interpolateMissingData(ranges);

  const points = interpolatedRanges.map((distance, index) => {
    const validDistance = Math.min(distance, maxDistance);
    const theta = index * angle_increment - Math.PI - Math.PI / 2; // Rotate by 90° counterclockwise
    const { x, y } = polarToCartesian(theta, validDistance);
    return { x, y, theta, distance: validDistance };
  });

  const scaleFactor = 250 / maxDistance;

  return (
    <svg
      width="500"
      height="500"
      viewBox="-250 -250 500 500"
      style={{ border: '5px solid black', borderRadius: '50%' }}
      shapeRendering="crispEdges"
    >
      <defs>
        <clipPath id="circleView">
          <circle cx="0" cy="0" r="250" />
        </clipPath>
      </defs>

      <g clipPath="url(#circleView)">
        <image href="/car.png" x="-25" y="-25" width="50" height="50" />

        {(() => {
          const groupedPolygons = [];
          let currentGroup = [];

          points.forEach((point, index) => {
            if (point.distance >= minDistance) {
              currentGroup.push(point);

              if (currentGroup.length >= maxConsecutivePoints + overlapPoints || index === points.length - 1) {
                const edgePoints = currentGroup.map((p) =>
                  polarToCartesian(p.theta, maxDistance * 1.02)
                );

                const polygonString = [
                  ...currentGroup.map((p) => `${p.x * scaleFactor},${p.y * scaleFactor}`),
                  ...edgePoints.reverse().map((p) => `${p.x * scaleFactor},${p.y * scaleFactor}`),
                ].join(' ');

                groupedPolygons.push(
                  <polygon
                    key={index}
                    points={polygonString}
                    fill="rgba(150, 150, 150, 1)"
                    stroke="none"
                  />
                );

                currentGroup = currentGroup.slice(-overlapPoints);
              }
            } else {
              if (currentGroup.length > 0) {
                currentGroup = [];
              }
            }
          });

          return groupedPolygons;
        })()}
      </g>
    </svg>
  );
};

export default LidarVisualization;
