var gMusic = { 
    standardGuitarTuning: [ 40, 45, 50, 55, 59, 64 ],
    notes: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
    noteOffsets: { 'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5, 'F#': 6, 'G': 7, 'G#': 8, 'A': -3, 'A#': -2, 'B': -1 },
    toMidi: function( noteSpec ) {
        var ns = noteSpec.match(/^(.*?)(\d+)$/ );
        return ( ( parseInt( ns[2] ) + 1 ) * 12 ) + gMusic.noteOffsets[ ns[1] ];
    }
}