import { Box, Typography } from '@mui/material';
import { DestructionSite } from 'components/Interfaces/DestructionSite';
import { Natar } from 'components/Interfaces/Natar';

interface EventSummery {
    eventId: string;
    destructionSites: DestructionSite[];
    recommendedNatars: Natar[];
}

const EventSummaryModal = ({ summary }: { summary: EventSummery }) => {
    if (!summary) return null;

    return (
        <Box sx={{ textAlign: 'left' }}>
            <Typography variant='h6'>Event ID: {summary.eventId}</Typography>

            <Typography variant='subtitle1' sx={{ mt: 2 }}>
                Destruction Sites:
            </Typography>
            {summary.destructionSites.map((site: any, idx: number) => (
                <Box key={idx} sx={{ ml: 2 }}>
                    <pre>{JSON.stringify(site, null, 2)}</pre>
                </Box>
            ))}

            <Typography variant='subtitle1' sx={{ mt: 2 }}>
                Recommended Natars:
            </Typography>
            {summary.recommendedNatars.map((natar: any, idx: number) => (
                <Box key={idx} sx={{ ml: 2, mb: 2 }}>
                    <Typography variant='body1'>Natar: {natar.name || natar.id}</Typography>
                    <Typography variant='body2' sx={{ ml: 2 }}>
                        Staff:
                    </Typography>
                    <ul>
                        {natar.staff.map((staff: any, sIdx: number) => (
                            <li key={sIdx}>{staff.name || staff.id}</li>
                        ))}
                    </ul>
                </Box>
            ))}
        </Box>
    );
};

export default EventSummaryModal;
