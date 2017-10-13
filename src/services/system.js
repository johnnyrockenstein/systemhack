let system = {
    name: 'System1',
    startHealth: 1000,
    health: 1000,
    status: 'ONLINE'
};

export function setSystemHealth(newValue) {
    system.health = newValue;
}

export default system;