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
  const points = ranges
    .filter(distance => distance >= minDistance) // Filter out points that are less than 0.25 meters
    .map((distance, index) => {
      // Cap the distance at maxDistance (10 meters)
      const cappedDistance = Math.min(distance, maxDistance);

      // Calculate theta for the point
      const theta = index * angle_increment - Math.PI;

      // Convert to Cartesian coordinates
      const { x, y } = polarToCartesian(theta, cappedDistance);
      return { x, y };
    });

  // Scale factor to fit the points in the SVG viewBox where 10 meters equals half the viewBox size
  const scaleFactor = 250 / maxDistance;  // 250 comes from half the viewBox size (500/2)

  return (
    <svg width="500" height="500" viewBox="-250 -250 500 500" style={{ border: '1px solid black' }}>
      {/* Car emoji at the origin */}
      <text x="0" y="0" textAnchor="middle" alignmentBaseline="middle" fontSize="24px">🚗</text>
      
      {/* Render LIDAR points */}
      {points.map((point, index) => (
        <circle
          key={index}
          cx={point.x * scaleFactor}
          cy={point.y * scaleFactor}
          r="2"
          fill="black"
        />
      ))}
    </svg>
  );
};

export default LidarVisualization;
