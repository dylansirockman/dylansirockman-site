document.addEventListener('DOMContentLoaded', async function() {
    const gamesContainer = document.getElementById('gamesContainer');

    const sportsLeagues = {
        mlb: 'baseball',
        nba: 'basketball',
        nhl: 'hockey'
    };

    // Function to create a container for each league's games and return the container
    function createLeagueContainer(leagueName) {
        const leagueContainer = document.createElement('div');
        leagueContainer.classList.add('container', 'mt-4'); // Correct way to add multiple classes
    
        const headerContainer = document.createElement('div');
        headerContainer.classList.add('d-flex', 'align-items-center'); // Flex container for header and logo
    
        const logo = document.createElement('img'); // Create image element for the logo
        logo.src = `https://a.espncdn.com/i/teamlogos/leagues/500/${leagueName.toLowerCase()}.png`; // Set source based on league
        logo.alt = `${leagueName} logo`; // Alt text for accessibility
        logo.style.height = '50px'; // Set height of the logo
        logo.style.marginRight = '10px'; // Right margin for spacing between logo and text
    
        const header = document.createElement('h1');
        header.textContent = leagueName.toUpperCase() + " Games Today";
    
        headerContainer.appendChild(logo); // Add logo to the container
        headerContainer.appendChild(header); // Add header to the container
    
        leagueContainer.appendChild(headerContainer); // Add the header and logo container to the league container
    
        const row = document.createElement('div');
        row.className = 'row justify-content-start'; // Ensure games are aligned to the start
        leagueContainer.appendChild(row);
    
        gamesContainer.appendChild(leagueContainer);
        return row; // Return the row to append games
    }

    // Fetch and render games from the ESPN API
    async function fetchAndRenderGames(sport, league) {
        try {
            const response = await fetch(`https://site.api.espn.com/apis/site/v2/sports/${sport}/${league}/scoreboard`);
            const data = await response.json();
            const leagueContainer = createLeagueContainer(league); // Create a separate container for each league
            renderGames(data.events, leagueContainer);
        } catch (error) {
            console.error('Failed to fetch data for ' + league.toUpperCase() + ':', error);
        }
    }

    // Render games to the specific row in the league container
    function renderGames(games, leagueContainer) {
        const row = document.createElement('div');
        row.className = 'row justify-content-start'; // Ensures games are centered and on their own line
        leagueContainer.appendChild(row); // Append row to the league-specific container

        if (games.length === 0) {
            const noGameCol = document.createElement('div');
            noGameCol.className = 'col-12 text-center';
            noGameCol.textContent = 'No games found for ' + league.toUpperCase();
            row.appendChild(noGameCol);
        } else {
            games.forEach(game => {
                const col = document.createElement('div');
                col.className = 'col-12 col-sm-6 col-md-4'; // Responsive grid columns
                const gameDiv = document.createElement('div');
                gameDiv.classList.add('game-box', 'p-3', 'mb-3', 'shadow-sm');
                gameDiv.onclick = () => window.location.href = `game-stats.html?gameId=${game.id}`;
    
                const headerDiv = document.createElement('div');
                headerDiv.classList.add('game-header');
    
                const gameName = document.createElement('h3');
                gameName.classList.add('game-title');
                gameName.textContent = game.name;
    
                const gameTime = document.createElement('p');
                gameTime.classList.add('game-time');
                gameTime.textContent = new Date(game.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    
                headerDiv.appendChild(gameName);
                headerDiv.appendChild(gameTime);
                gameDiv.appendChild(headerDiv);
    
                const teamsDiv = document.createElement('div');
                teamsDiv.classList.add('teams-container');
    
                game.competitions[0].competitors.forEach(team => {
                    const teamDiv = document.createElement('div');
                    teamDiv.classList.add('team-info');
    
                    const teamLogo = document.createElement('img');
                    teamLogo.src = team.team.logo;
                    teamLogo.alt = team.team.displayName;
                    teamLogo.classList.add('team-logo');
    
                    const teamDetails = document.createElement('div');
                    teamDetails.classList.add('team-details');
    
                    const teamName = document.createElement('p');
                    teamName.classList.add('team-name');
                    teamName.textContent = `${team.team.displayName}`;
    
                    const teamScore = document.createElement('span');
                    teamScore.classList.add('team-score');
                    teamScore.textContent = ` - ${team.score || 'TBD'}`;
    
                    teamName.appendChild(teamScore);
                    teamDetails.appendChild(teamName);
                    teamDiv.appendChild(teamLogo);
                    teamDiv.appendChild(teamDetails);
                    teamsDiv.appendChild(teamDiv);
                });
    
                gameDiv.appendChild(teamsDiv);
                col.appendChild(gameDiv);
                row.appendChild(col);
            });
        }
    }
    

    // Load all games in a specified order
    await fetchAndRenderGames(sportsLeagues.mlb, 'mlb');
    await fetchAndRenderGames(sportsLeagues.nba, 'nba');
    await fetchAndRenderGames(sportsLeagues.nhl, 'nhl');
});
