const instruments = [
  {
    id: 1,
    name: '吉他',
    emoji: '🎸',
    description: '支持6弦吉他的标准调音（EADGBE），以及多种特殊调弦方式。',
    strings: ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'],
  },
  {
    id: 2,
    name: '尤克里里',
    emoji: '🎻',
    description: '支持尤克里里的标准调音（GCEA），让您的小吉他音色完美。',
    strings: ['G4', 'C4', 'E4', 'A4'],
  },
  {
    id: 3,
    name: '贝斯',
    emoji: '🎸',
    description: '支持4弦贝斯的标准调音（EADG），也适用于5弦和6弦贝斯。',
    strings: ['E1', 'A1', 'D2', 'G2'],
  },
  {
    id: 4,
    name: '小提琴',
    emoji: '🎻',
    description: '支持小提琴的标准调音（GDAE），精准检测每根弦的音高。',
    strings: ['G3', 'D4', 'A4', 'E5'],
  },
];

export default function Instruments() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {instruments.map((instrument) => (
        <div
          key={instrument.id}
          className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 text-center"
        >
          <div className="text-6xl mb-4">{instrument.emoji}</div>
          <h3 className="text-xl font-bold text-dark mb-3">
            {instrument.name}
          </h3>
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
            {instrument.description}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {instrument.strings.map((note, index) => (
              <div
                key={index}
                className="px-3 py-1 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary rounded-full text-sm font-medium"
              >
                {note}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}