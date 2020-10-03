import React from 'react';

export default ({ events }) => <div>{events.map((event) => event.name)}</div>;
