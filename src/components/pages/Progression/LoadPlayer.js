import React from 'react';
import { Redirect } from 'react-router-dom'
import Globals from '../../Globals';



class LoadPlayer extends React.Component {

  componentDidMount () {
    
    fetch(
      `https://www.bungie.net/Platform/Destiny2/${ this.props.data.match.params.membershipType }/Profile/${ this.props.data.match.params.membershipId }/?components=100,104,200,202,204,205,800,900`,
      {
        headers: {
          "X-API-Key": Globals.key.bungie,
        }
      }
    )
    .then(response => {
      return response.json();
    })
      .then(ProfileResponse => {
  
        ProfileResponse.Response.characters.data = Object.values(ProfileResponse.Response.characters.data).sort(function(a, b) { return parseInt(b.minutesPlayedTotal) - parseInt(a.minutesPlayedTotal) });

        if (!this.props.data.match.params.characterId || ProfileResponse.Response.characters.data.filter(character => character.characterId === this.props.data.match.params.characterId).length < 1) {
          let temp
          if (this.props.data.match.params.characterId) {
            temp = this.props.data.match.params.characterId
          }
          this.props.data.history.push(`${this.props.data.match.url.replace(this.props.data.match.params.characterId, "")}${ProfileResponse.Response.characters.data[0].characterId}${temp ? `/${temp}` : ``}`);
        }

        this.props.set(this.props.data.match.params.characterId ? this.props.data.match.params.characterId : ProfileResponse.Response.characters.data[0].characterId, 
          ProfileResponse.Response)

      })
    .catch(error => {
      console.log(error);
    })

  }


  render() {

    return (
      <div className="view" id="loading">
        <p>loading user</p>
      </div>
    )

  }




}

export default LoadPlayer