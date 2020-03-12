let search = []

window.onload = () => {
  const container = document.getElementById('pokemon-list')
  container.classList.add('loading')
  container.innerHTML = `
    <div>
      <p>Loading Pokedex</p>   
      <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
    </div>
  `
  
  axios.get('https://pokeapi.co/api/v2/pokedex/1')
    .then(res => {
      container.classList.remove('loading')
      pokemon = (res.data.pokemon_entries || []).map(mon => ({
        number: mon.entry_number,
        name: mon.pokemon_species.name,
      }))
      search = pokemon
      
      let html = ''

      pokemon.map(mon => {
        html += `
          <div id="pokemon-${mon.number}" class="pokemon" onClick="handlePokemonClick(${mon.number})">
            <span class="info">
              <span class="number">${mon.number}</span>
              <span class="name">${mon.name}</span>
            </span>
            <span class="spacer"></span>
            <div id="pokemon-loading-${mon.number}">
            </div>
          </div>
        `
      })

      container.innerHTML = html
    })
    .catch(err => {
      container.classList.remove('loading')
      container.innerHTML = `
        <div class="error">
          Error Loading Pokedex
        </div>
      `
      console.error(err)
    })
}

const handlePokemonClick = (id) => {
  const elems = document.querySelectorAll('.loader-active')
  elems.forEach(el => {
    el.classList.remove('loader-active')
    el.innerHTML = ''
  })

  let container = document.querySelector(`#pokemon-loading-${id}`)
  container.classList.add('loader-active')
  container.innerHTML = `
    <div class="lds-dual-ring"></div>
  `

  axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`)
    .then(res => {
      container.innerHTML = ''
      const { data } = res
      const {
        sprites,
        id,
        name,
        types,
        height,
        weight,
        abilities,
        stats
      } = data
      container.classList.remove('loader-active')
      let html = `
        <div class="images">
          <div class="regular">
            <img src="${sprites.front_default}" alt="front" class="front" />
            <p>Regular</p>
          </div>
          <div class="shiny">
            <img src="${sprites.front_shiny}" alt="front" class="front" />
            <p>Shiny</p>
          </div>
        </div>
        <p class="title">
          <span class="number">#${id}</span>
          <span class="name">${name}</span>
        </p>
        <hr />
        <h3>Type</h3>
        <ul>
      `

      types.map(type => {
        html += `
          <li>${type.type.name}</li>
        `
      })

      html += `
        </ul>
        <hr />
        <h3>Basic Info</h3>
        <p>Height: ${getHeight(height)}</p>
        <p>Weight: ${weight} lbs</p>
        <hr />
        <h3>Abilities</h3>
        <ul>
      `

      abilities.map(ability => {
        html += `
          <li>${ability.ability.name} ${ability.is_hidden? '(hidden)' : ''}</li>
        `
      })

      html += `
        </ul>
        <hr />
        <h3>Stats</h3>
        <table>
          <thead>
            <tr>
              <th>Stat</th>
              <th>Base</th>
              <th>Effort</th>
            </tr>
          </thead>
          <tbody>        
      `

      stats.map(stat => {
        html += `
          <tr>
            <td class="stat">${stat.stat.name}</td>
            <td>${stat.base_stat}</td>
            <td>${stat.effort}</td>
          </tr>
        `
      })

      html += '</tbody></table>'

      document.querySelector('#pokedex-details').innerHTML = html
    })
    .catch(err => {
      container.innerHTML = ''
      container.classList.remove('loader-active')
      document.querySelector('#pokedex-details').innerHTML = `
        <div>Error Loading Info</div>
      `
    })
}

const getHeight = height => {
  let totalIn = height * 3.937
  let ft = parseInt(totalIn / 12)
  let inches = parseInt(totalIn % 12)

  if (ft === 0)
    return `${inches}"`
  
  return `${ft}' ${inches}"`
}