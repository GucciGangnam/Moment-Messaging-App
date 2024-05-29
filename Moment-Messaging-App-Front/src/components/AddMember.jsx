// IMPORTS 
// Styles 
import "./AddMember.css"
// Variables 
const backendUrl = import.meta.env.VITE_BACKEND_URL;




// COMPOENNT 

export const AddMember = ({ userData, offlineGroupOBJ, setOfflineGroupOBJ, memberAdded }) => {

    // Add member to group function
    const addMemberToGroup = async (contact) => {
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('UserAccessToken')}`
            },
            body: JSON.stringify({
                group: offlineGroupOBJ.ID,
                memberToAdd: contact.ID
            })
        };
        try {
            const response = await fetch(`${backendUrl}/groups/addgroupmember`, requestOptions);
            const data = await response.json();
            if (!response.ok) {
                console.log(data);
            } else {
                // Update the local state with the new member if the response is okay
                setOfflineGroupOBJ(prevState => ({
                    ...prevState,
                    MEMBERS: [
                        ...prevState.MEMBERS,
                        {
                            ID: contact.ID,
                            FIRST_NAME: contact.FIRST_NAME,
                            LAST_NAME: contact.LAST_NAME,
                            MESSAGE: '',
                            POST_TIME: null
                        }
                    ]
                }));
                console.log(data);
                memberAdded();
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
    }

    const userContactsArray = userData.userInfo.CONTACTS;
    const currentGroupMembersArray = offlineGroupOBJ.MEMBERS;

    // Filter out contacts that are already in the group members array
    const filteredContacts = userContactsArray.filter(contact =>
        !currentGroupMembersArray.some(member => member.ID === contact.ID)
    );

    return (
        <div className="AddMember">
            Contacts
            {filteredContacts.map(contact => (
                <div
                    key={contact.ID}
                    className="Contact"
                    onClick={() => { addMemberToGroup(contact) }}>
                    {contact.FIRST_NAME} {contact.LAST_NAME}
                </div>
            ))}
        </div>
    );
};


// IF THE RESPONSE IS OK =>
//// YOU NEED TO SET THE OFFLINE GROUP OBJ TO INCLIUDE TEH NEW MEMEBR
//// send it to server
//// relay from server 
//// setOfflineGroupOBJ to no data received from server

