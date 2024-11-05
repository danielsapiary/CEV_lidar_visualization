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

  const points = ranges.map((distance, index) => {
    const validDistance = distance >= minDistance ? Math.min(distance, maxDistance) : distance;
    const theta = index * angle_increment - Math.PI;
    const { x, y } = polarToCartesian(theta, validDistance);
    return { x, y, theta, distance };
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

              // Ensure groups overlap by using `overlapPoints`
              if (currentGroup.length >= maxConsecutivePoints + overlapPoints || index === points.length - 1) {
                // Calculate outer edge points with additional overlap extension
                const edgePoints = currentGroup.map(p => polarToCartesian(p.theta, maxDistance * 1.02)); // Extend by 2%

                // Construct polygon points, reusing the overlap points for smooth connection
                const polygonString = [
                  ...currentGroup.map(p => `${p.x * scaleFactor},${p.y * scaleFactor}`),
                  ...edgePoints.reverse().map(p => `${p.x * scaleFactor},${p.y * scaleFactor}`)
                ].join(" ");

                groupedPolygons.push(
                  <polygon
                    key={index}
                    points={polygonString}
                    fill="rgba(150, 150, 150, 1)" // Slightly darker fill for visibility
                    stroke="none"
                  />
                );

                // Start the next group with the last `overlapPoints` of the current group
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
