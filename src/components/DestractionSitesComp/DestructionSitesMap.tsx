
export interface DestructionSite {
    street: string;
    number: string;
    casualties: string;
}

interface MapComponentProps {
    destructionSites: DestructionSite[];
    addDestructionSite: (site: DestructionSite) => void;
    removeDestructionSite: (site: DestructionSite) => void;
    setStreetNames: (names: string[]) => void;
}

const MapComponent = ({ destructionSites, addDestructionSite, removeDestructionSite, setStreetNames } : MapComponentProps) => {
    return (
        <></>
    );
};

export default MapComponent;
