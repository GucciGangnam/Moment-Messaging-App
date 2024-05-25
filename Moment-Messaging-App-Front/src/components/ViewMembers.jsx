// IMPORTS //
// Styles 
import "./ViewMembers.css"







// COMPONENT //
export const ViewMembers = ({ currentGroupOBJ, userGroupData, userData, getUserAccountInfo }) => {

    // Find the index of the group object in userGroupData that matches the currentGroupOBJ ID
    const groupIndex = userGroupData.findIndex(group => group.ID === currentGroupOBJ.ID);

    

    return (
        <div className="ViewMembers">
            Members
            {userGroupData[groupIndex].MEMBERS.map((member) => ( 
                <div className="Member" key={member.ID}>{member.FIRST_NAME} {member.LAST_NAME}</div>
            ))}
        </div>
    )
}