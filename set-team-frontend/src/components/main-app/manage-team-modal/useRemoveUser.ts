import { DateCore, ProjDate } from '../../../store/apis/datesApi';
import { useRemoveUserFromProjectMutation } from '../../../store/store';

interface RemoveUserArgs {
    userToRemove: string;
    projDates: ProjDate[];
    project: Project;
}

export const useRemoveUser = async ({
    userToRemove,
    projDates,
    project,
}: RemoveUserArgs) => {
    const [removeUserFromProject] = useRemoveUserFromProjectMutation();
    if (!projDates) {
        console.error('projDates undefined');
        return;
    }
    // provide follwing data to RTK Query API
    // projectId - project.SK
    // updated projectTeam
    const updatedProjectTeam = project.projTeam.filter(
        (sparkName) => sparkName !== userToRemove
    );
    // array of objects containign date and updatedTeamStatus
    const datesToUpdate: DateCore[] = [];
    projDates?.forEach((date) => {
        if (
            date.teamStatus.find(
                (statusEntry) =>
                    statusEntry.userId === userToRemove &&
                    statusEntry.status === project.SK
            )
        ) {
            const updatedTeamStatus = date.teamStatus.map((statusEntry) => {
                if (statusEntry.userId === userToRemove)
                    return {
                        userId: statusEntry.userId,
                        status: 'available',
                    };
                return statusEntry;
            });
            datesToUpdate.push({
                SK: date.SK,
                teamStatus: updatedTeamStatus,
                sessionId: date.sessionId,
            });
        }
    });

    let refetchFlag = false;

    // feed data to RTK Query
    await removeUserFromProject({
        projId: project.SK,
        projTeam: updatedProjectTeam,
        datesToUpdate,
    })
        .unwrap()
        .catch(() => (refetchFlag = true));
    return refetchFlag;
};
