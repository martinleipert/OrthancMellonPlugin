# Orthanc Mellon 

Extends the Orthanc explorer by some functionality necessary to use it with Single Sign On. 
Additionally some functionality for the communication with a WebService for the advanced Authorization Plugin is added.

For the adding of functionality embedded ressources are used and provided by the plugin. 
To compile the plugin it is necessary to put the directory into the Plugins folder of the Orthanc project.
To compile it without this project directory the CMakeListsFile has to be modified and the correct path to the orthanc sources has to be provided.

## Functionality provided

In the file Resources/OrthancExplorer.js:

- **Logout Button** with a link to the mod_mellon logout link
- At each patient page the possibility to grant access to other users or remove the access

In the file Resources/PrivilegeAdministration.html: 
- A static html page which allows to modify the group users belong to
