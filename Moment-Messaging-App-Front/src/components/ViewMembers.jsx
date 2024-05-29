// IMPORTS //
// Styles 
import "./ViewMembers.css"







// COMPONENT //
export const ViewMembers = ({ offlineGroupOBJ }) => {
    return (
        <div className="ViewMembers">
            {offlineGroupOBJ.MEMBERS ? (
                offlineGroupOBJ.MEMBERS.map((member, index) => (
                    <div key={index} className="Member">
                        {member.FIRST_NAME} {member.LAST_NAME}
                    </div>
                ))
            ) : (
                <div>No members available</div>
            )}
        </div>
    );
};
