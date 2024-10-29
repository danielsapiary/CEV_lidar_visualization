import React from 'react';

const LidarVisualization = ({ scanData }) => {
  const { angle_increment, ranges } = scanData;

  // Maximum distance to display (in meters)
  const maxDistance = 10;
  const minDistance = 0.5; // Minimum distance to display (filter out points below this)

  // Polar to Cartesian conversion
  const polarToCartesian = (theta, distance) => {
    const x = distance * Math.cos(theta);
    const y = distance * Math.sin(theta);
    return { x, y };
  };

  // Map over the ranges array and calculate the Cartesian coordinates for each point
  const points = ranges.map((distance, index) => {
    // Set distance to minimum threshold if below minDistance
    const validDistance = distance >= minDistance ? Math.min(distance, maxDistance) : distance;

    // Calculate theta for the point
    const theta = index * angle_increment - Math.PI;

    // Convert to Cartesian coordinates
    const { x, y } = polarToCartesian(theta, validDistance);
    return { x, y, theta, distance };
  });

  // Scale factor to fit the points in the SVG viewBox where 10 meters equals half the viewBox size
  const scaleFactor = 250 / maxDistance; // 250 comes from half the viewBox radius

  return (
    <svg width="500" height="500" viewBox="-250 -250 500 500" style={{ border: '5px solid black', borderRadius: '50%' }}>
      <defs>
        {/* Define a circular clipping path */}
        <clipPath id="circleView">
          <circle cx="0" cy="0" r="250" />
        </clipPath>
      </defs>

      {/* Apply the clipping path to keep everything inside a circle */}
      <g clipPath="url(#circleView)">
        {/* Car image at the origin */}
        <image href="/car.png" x="-50" y="-50" width="100" height="100" />

        {/* Debug yellow point at the middle */}
        {/* <circle cx="0" cy="0" r="5" fill="yellow" /> */}

        {/* Render LIDAR points and rays */}
        {points.map((point, index) => {
          const { x, y, theta, distance } = point;

          return (
            <g key={index}>
              {/* Draw the point always */}
              <circle cx={x * scaleFactor} cy={y * scaleFactor} r="2" fill="cyan" />

              {/* Draw a ray extending from the point to the maximum distance if beyond minDistance */}
              {distance >= minDistance && (
                <line
                  x1={x * scaleFactor}
                  y1={y * scaleFactor}
                  x2={(maxDistance * Math.cos(theta)) * scaleFactor}
                  y2={(maxDistance * Math.sin(theta)) * scaleFactor}
                  stroke="rgba(0, 0, 0, 0.25)" // Semi-transparent line
                  strokeWidth="5"
                />
              )}
            </g>
          );
        })}
      </g>
    </svg>
  );
};

export default LidarVisualization;
