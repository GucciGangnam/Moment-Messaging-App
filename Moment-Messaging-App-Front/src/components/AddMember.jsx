// IMPORTS 
// Styles 
import "./AddMember.css"
// Variables 
const backendUrl = import.meta.env.VITE_BACKEND_URL;




// COMPOENNT 

export const AddMember = ({ currentGroupOBJ, userData, getUserAccountInfo }) => {

    //Filter contacts for those not in group
    const userContacts = userData.userInfo.CONTACTS;
    const groupMembers = currentGroupOBJ.MEMBERS;
    // Extract IDs of group members for easy lookup
    const groupMemberIds = groupMembers.map(member => member.ID);
    // Filter out contacts that are already group members
    const filteredContacts = userContacts.filter(contact => !groupMemberIds.includes(contact.ID));


    const handleAddContacttoGroup = async (contactID) => {
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('UserAccessToken')}`
            },
            body: JSON.stringify({
                "group": currentGroupOBJ.ID,
                "memberToAdd": contactID
            })
        };
        try {
            const response = await fetch(`${backendUrl}/groups/addgroupmember`, requestOptions);
            const responseData = await response.json();
            if (!response.ok) {
                console.log(responseData)
                getUserAccountInfo();
            } else {
                console.log(responseData)
                getUserAccountInfo();
            }
        } catch (error) {
            console.error(error);
            // Set fetch error to true
        }
    }

    return (
        <div className="AddMember">
            {filteredContacts.map(contact => (
                <div
                    onClick={() => { handleAddContacttoGroup(contact.ID) }}
                    className="Contact"
                    key={contact.ID}>
                    {contact.FIRST_NAME} {contact.LAST_NAME}
                </div>
            ))}
        </div>
    );
};