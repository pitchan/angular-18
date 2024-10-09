import { Pokemon } from "../model/pokemon.model";

// Mapper pour transformer les objets retournés par l'API
export function mapPokemonList(pokemonList: any): Pokemon[] {
    
    return pokemonList.results.map((pokemon: any) => {
        // Extraire l'ID du Pokémon depuis l'URL (l'ID est à la fin de l'URL)
        const id = pokemon.url ? extractPokemonId(pokemon.url) : pokemon.id;

        // Construire l'URL de l'image
        const pictureUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
        const bigPictureUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

        // Retourner l'objet final conforme à l'interface Pokemon
        return {
            name: pokemon.name,
            id: id,
            url: pokemon.url,
            sprites: {
                picture: pictureUrl,
                bigPicture: bigPictureUrl
            }
        };
    });
}
  
// Fonction pour extraire l'ID du Pokémon à partir de l'URL
function extractPokemonId(url: string): number {
    // L'ID est le dernier segment de l'URL (après le dernier "/")
    const parts = url.split('/');
    return parseInt(parts[parts.length - 2], 10); // L'avant-dernier élément est l'ID
}