import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Box, TextField, Button, List, ListItem, Typography } from '@mui/material';
import { SEARCH_REPOSITORIES, GET_SAVED_REPOSITORIES, SAVE_REPOSITORY ,MARK_RELEASE_SEEN, RepositoryInput,SaveRepositoryVariables} from '../graphql';

const RepositoryManager: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [userId] = useState<string>('59743564-2c8c-4c21-962f-fbcdc01d68d5'); // Replace with user ID

  const { data: searchData, refetch: searchRefetch } = useQuery(SEARCH_REPOSITORIES, {
    variables: { query: searchQuery },
    skip: !searchQuery,
  });
//   console.log(searchData);

  const { data: savedData, refetch: savedRefetch } = useQuery(GET_SAVED_REPOSITORIES, {
    variables: { userId },
  });

  const [saveRepository, { loading, error }] = useMutation< SaveRepositoryVariables>(
    SAVE_REPOSITORY,
    {
      onCompleted: (data) => {
        console.log('Repository saved successfully:');
        savedRefetch(); 
      },
      onError: (err) => {
        console.error('Error saving repository:', err);
      },
    }
   );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchRefetch();
  };

  const handleSave = (repository: RepositoryInput) => {
    setSearchQuery('');
    saveRepository({ variables: { userId, repository } })
      .then((response) => {
        console.log('Repository saved successfully:', response?.data);
      })
      .catch((err) => {
        console.error('Error saving repository:', err);
    });
    }
    const [markReleaseAsSeenMutation] = useMutation(MARK_RELEASE_SEEN, {
        onCompleted: () => {
         savedRefetch(); // Refetch saved repositories post completion
          console.log('Marked as seen successfully');
        },
        onError: (error) => {
          console.error('Error marking release as seen:', error);
        },
      });
    
    const markReleaseAsSeen = async (repo: any) => {
    try {
        await markReleaseAsSeenMutation({
        variables: {
            userId,
            repositoryId:repo.id
        },
        });
        console.log(`Repository ${repo.name} marked as seen`);
    } catch (error) {
        console.error('Failed to mark as seen:', error);
    }
    };

    const formatDate=(date:string)=>{
        const dateObject = new Date(date);

        return dateObject.toISOString().split('T')[0] + ' ' + dateObject.toTimeString().split(' ')[0];
    }


  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, height: '100vh' }}>
      {/* Search Pane */}
      <Box sx={{ flex: 1, p: 2, borderRight: { md: '1px solid #ccc' }, borderBottom: { xs: '1px solid #ccc', md: 'none' } }}>
        <Typography variant="h6">Search Repositories</Typography>
        <form onSubmit={handleSearch}>
          <TextField
            fullWidth
            placeholder="Search for repositories"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button type="submit" variant="contained" fullWidth>
            Search
          </Button>
        </form>
        <List>
          {searchData?.searchRepositories?.map((repo:any) => (
            <ListItem key={repo.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="body1">{repo.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {repo.description}
                </Typography>
              </Box>
              <Button variant="outlined" onClick={() => handleSave(repo)}>
                Save
              </Button>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Saved Repositories Pane */}
      <Box sx={{ flex: 1, p: 2 }}>
        <Typography variant="h6">Saved Repositories</Typography>
        <List>
        {savedData?.getSavedRepositories?.length > 0 ? (
            savedData.getSavedRepositories.map((repo: any) => (
                <ListItem key={repo.id}
                sx={{
                    backgroundColor: repo.seen ? 'white' : '#ffe6e6', // Light pink background if not seen
                    borderRadius: '8px', // Optional: Rounded corners
                    marginBottom: '8px', // Optional: Spacing between list items
                    padding: '16px', // Optional: Padding for better appearance
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                <Box>
                    <Typography variant="body1">{repo.name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                    {repo.latestRelease ? `Latest Release: ${formatDate(repo.latestRelease)}` : 'No release info available'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                    Owner: {repo.owner}
                    </Typography>
                </Box>
                {!repo.seen && (
                    <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => markReleaseAsSeen(repo)}
                    >
                    Mark Seen
                    </Button>
                )}
                </ListItem>
            ))
            ) : (
            <Typography variant="body2" color="textSecondary">
                No saved repositories to display.
            </Typography>
            )}
        </List>
      </Box>
    </Box>
  );
};

export default RepositoryManager;
