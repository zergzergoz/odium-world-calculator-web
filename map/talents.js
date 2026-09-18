const treeDefinitions = [
  { id:'killer', name:'Убийца', emblem:'⚔', theme:'ember', talents:[
    [0,0,1],[1,0,1],[2,0,3],[3,0,1],[0,1,2],[1,1,2],[2,1,2],[3,1,3],[0,2,2],[1,2,2],[2,2,2],[3,2,2],[0,3,2],[1,3,2],[2,3,2],[3,3,2],[2,4,1],[3,4,2],[1,5,1],[2,5,1],[3,5,1]
  ], links:[[16,19],[17,20]] },
  { id:'hunter', name:'Охотник', emblem:'◆', theme:'frost', talents:[
    [0,0,1],[1,0,1],[2,0,3],[3,0,1],[0,1,3],[1,1,1],[2,1,5],[3,1,1],[0,2,5],[1,2,2],[2,2,1],[3,2,2],[0,3,1],[1,3,3],[2,3,1],[3,3,3],[0,4,1],[1,4,2],[2,4,1],[3,4,2],[2,5,1]
  ], links:[] },
  { id:'siege', name:'Осадное дело', emblem:'◉', theme:'verdant', talents:[
    [0,0,1],[1,0,3],[2,0,1],[3,0,2],[0,1,3],[1,1,3],[2,1,2],[3,1,2],[0,2,1],[1,2,1],[2,2,2],[3,2,1],[0,3,2],[1,3,2],[2,3,3],[3,3,2],[0,4,1],[1,4,1],[2,4,1],[3,4,2],[0,5,3],[1,5,1]
  ], links:[[1,5],[2,6],[5,9],[6,10],[8,12],[11,15]] },
  { id:'smith', name:'Кузнец', emblem:'⚒', theme:'ember', talents:[
    [0,0,1],[1,0,1],[2,0,1],[3,0,2],[0,1,1],[1,1,1],[2,1,1],[3,1,3],[0,2,3],[1,2,3],[3,2,1],[0,3,1],[1,3,1],[2,3,1],[3,3,3],[0,4,3],[1,4,5],[2,4,1],[3,4,1],[0,5,1],[1,5,1],[2,5,1],[3,5,3]
  ], links:[] },
  { id:'alchemist', name:'Алхимик', emblem:'◇', theme:'frost', talents:[
    [0,0,1],[1,0,1],[2,0,3],[3,0,1],[0,1,1],[2,1,5],[0,2,1],[1,2,3],[2,2,1],[3,2,4],[0,3,1],[1,3,4],[2,3,1],[0,4,1],[1,4,5],[2,4,3],[3,4,1],[0,5,1],[1,5,1],[2,5,1]
  ], links:[[0,4],[2,5],[4,6],[5,8],[6,10],[8,12],[10,13],[12,15]] },
  { id:'gatherer', name:'Собиратель', emblem:'◉', theme:'verdant', talents:[
    [0,0,1],[1,0,1],[2,0,1],[3,0,1],[0,1,1],[1,1,3],[2,1,1],[3,1,3],[0,2,3],[1,2,3],[2,2,3],[3,2,3],[0,3,1],[1,3,1],[2,3,1],[3,3,3],[0,4,3],[1,4,1],[2,4,1],[3,4,1],[2,5,1]
  ], links:[[8,12],[9,13],[10,14],[11,15],[14,18],[15,19],[18,20]] }
];


const talentDetails = {
  killer: {
    0: { name: 'Опыт Сражений', levels: ['Персонаж получает EXP за главу, полученную в битве с вражескими персонажами'] },
    1: { name: 'Знания Жизни', levels: ['Ваш персонаж, получает способность видеть жизненные показатели вражеского персонажа.'] },
    2: { name: 'Поступь Ветра', levels: [
      'Увеличивает скорость передвижения персонажа +1ед.',
      'Увеличивает скорость передвижения персонажа +2ед.',
      'Увеличивает скорость передвижения персонажа +4ед.'
    ] },
    3: { name: 'Божественный Щит', levels: ['Персонаж получает умение "Божественный Щит", защищающий от негативных эффектов.'] },
    4: { name: 'Стойкость Духа', requiredPoints: 1, requiredLevel: 33, levels: [
      'Увеличивает максимальное количество Боевого Духа у персонажа на 3%.',
      'Увеличивает максимальное количество Боевого Духа у персонажа на 7%.'
    ] },
    5: { name: 'Крепкое Здоровье', requiredPoints: 1, requiredLevel: 33, levels: [
      'Увеличивает максимальное количество Здоровья у персонажа на 2%.',
      'Увеличивает максимальное количество Здоровья у персонажа на 4%.'
    ] },
    6: { name: 'Боевой Опыт', requiredPoints: 1, requiredLevel: 33, levels: [
      'Увеличивает получаемый опыт на 15% при победе над вражеским персонажем.',
      'Увеличивает получаемый опыт на 30% при победе над вражеским персонажем.'
    ] },
    7: { name: 'Триумф', requiredPoints: 1, requiredLevel: 33, levels: [
      'Увеличивает количество получаемой славы с вражеских персонажей на 4%.',
      'Увеличивает количество получаемой славы с вражеских персонажей на 10%.',
      'Увеличивает количество получаемой славы с вражеских персонажей на 20%.'
    ] },
    8: { name: 'Защита от Магии', requiredPoints: 3, requiredLevel: 43, levels: [
      'Увеличивает защиту от Классов: Магов и Чернокнижников на 2%.',
      'Увеличивает защиту от Классов: Магов и Чернокнижников на 4%.'
    ] },
    9: { name: 'Гибкая Броня', requiredPoints: 3, requiredLevel: 43, levels: [
      'Увеличивает защиту от Классов: Воины в Легкой Броне на 2%.',
      'Увеличивает защиту от Классов: Воины в Легкой Броне на 4%.'
    ] },
    10: { name: 'Железная Стена', requiredPoints: 3, requiredLevel: 43, levels: [
      'Увеличивает защиту от Классов: Воины в Тяжелой Броне на 2%.',
      'Увеличивает защиту от Классов: Воины в Тяжелой Броне на 4%.'
    ] },
    11: { name: 'Теневая Поступь', requiredPoints: 3, requiredLevel: 43, levels: [
      'Увеличивает защиту от Классов: Стрелков и Убийц на 2%.',
      'Увеличивает защиту от Классов: Стрелков и Убийц на 4%.'
    ] },
    12: { name: 'Контракт: Волшебник', requiredPoints: 8, requiredLevel: 53, levels: [
      'Увеличивает урон по Классам: Магов и Чернокнижников на 2%.',
      'Увеличивает урон по Классам: Магов и Чернокнижников на 4%.'
    ] },
    13: { name: 'Контракт: Фехтовальщик', requiredPoints: 8, requiredLevel: 53, levels: [
      'Увеличивает урон по Классам: Воины в Легкой Броне на 2%.',
      'Увеличивает урон по Классам: Воины в Легкой Броне на 4%.'
    ] },
    14: { name: 'Контракт: Колосс', requiredPoints: 8, requiredLevel: 53, levels: [
      'Увеличивает урон по Классам: Воины в Тяжелой Броне на 2%.',
      'Увеличивает урон по Классам: Воины в Тяжелой Броне на 4%.'
    ] },
    15: { name: 'Контракт: Следопыт', requiredPoints: 8, requiredLevel: 53, levels: [
      'Увеличивает урон по Классам: Стрелков и Убийц на 2%.',
      'Увеличивает урон по Классам: Стрелков и Убийц на 4%.'
    ] },
    16: { name: 'Безупречное Воскрешение', requiredPoints: 17, requiredLevel: 63, levels: [
      'После воскрешения персонаж возрождается с полными Очками Здоровья и Боевым Духом.'
    ] },
    17: { name: 'Продление', requiredPoints: 17, requiredLevel: 63, levels: [
      'Увеличивает время действия эффекта "Божественный щит" на 1сек.',
      'Увеличивает время действия эффекта "Божественный щит" на 2сек.'
    ] },
    18: { name: 'Ярость', requiredPoints: 27, requiredLevel: 73, levels: [
      'Время от времени персонаж впадает в ярость, увеличивая свои атакующие характеристики.'
    ] },
    19: { name: 'Ангел-Хранитель', requiredPoints: 27, requiredLevel: 73, requiredTalent: { index:16, level:1, name:'Безупречное Воскрешение' }, levels: [
      'Персонаж получает возможность вернуться на место своей гибели через Портал Ангелов. При смерти от вражеского персонажа.'
    ] },
    20: { name: 'Божественное Покровительство', requiredPoints: 27, requiredLevel: 73, requiredTalent: { index:17, level:2, name:'Продление' }, levels: [
      'Увеличивает время действия умения "Божественный щит" и "Защита от Контроля" на 1 сек.'
    ] }
  },

  hunter: {
    0: { name: 'Разделка Туши', levels: ['Персонаж получает способность разделывать туши убитых монстров.'] },
    1: { name: 'Бестиарий', levels: ['Персонаж ведет записи, в которых хранятся все тайны монстров, на которых он охотится.'] },
    2: { name: 'Крепкие Карманы', levels: ['Уменьшает шанс потери предметов с персонажа при смерти от монстров на 33%.','Уменьшает шанс потери предметов с персонажа при смерти от монстров на 66%.','Уменьшает шанс потери предметов с персонажа при смерти от монстров на 100%.'] },
    3: { name: 'Ускоренное Обучение', levels: ['Увеличивает количество опыта, получаемого персонажем при охоте на монстров +5%.'] },
    4: { name: 'Грузоподъемность', requiredPoints: 1, requiredLevel: 33, levels: ['Увеличивает грузоподъемность персонажа на 5%.','Увеличивает грузоподъемность персонажа на 15%.','Увеличивает грузоподъемность персонажа на 30%.'] },
    5: { name: 'Невосприимчивость', requiredPoints: 1, requiredLevel: 33, levels: ['Персонаж становится невосприимчив к слабым проклятиям монстров.'] },
    6: { name: 'Сокровищница Судеб', requiredPoints: 1, requiredLevel: 33, levels: ['При смерти монстра, с определенным шансом Вы может обнаружить сундук с золотом.','Повышает эту вероятность на 25%.','Повышает эту вероятность на 50%.','Повышает эту вероятность на 75%.','Повышает эту вероятность на 100%.'] },
    7: { name: 'Разложение', requiredPoints: 1, requiredLevel: 33, levels: ['Персонаж получает способность понизить защитные и атакующие характеристики монстра.'] },
    8: { name: 'Защита от Монстров', requiredPoints: 3, requiredLevel: 43, levels: ['Увеличивает Защиту от Монстров на 1%.','Увеличивает Защиту от Монстров на 3%.','Увеличивает Защиту от Монстров на 5%.','Увеличивает Защиту от Монстров на 7%.','Увеличивает Защиту от Монстров на 9%.'] },
    9: { name: 'Путь Веры', requiredPoints: 3, requiredLevel: 43, levels: ['Увеличивает Значение получаемых персонажем очков религии на 1ед.','Увеличивает Значение получаемых персонажем очков религии на 2ед.'] },
    10: { name: 'Сокровища Боссов', requiredPoints: 3, requiredLevel: 43, levels: ['Персонаж получает способность, взламывать сундуки, которые появляются после победы над боссом.'] },
    11: { name: 'Мастер Заданий', requiredPoints: 3, requiredLevel: 43, levels: ['Персонаж получает больше опыта за выполнение заданий на 10%.','Персонаж получает больше опыта за выполнение заданий на 25%.'] },
    12: { name: 'Призыв Союзника', requiredPoints: 8, requiredLevel: 53, levels: ['Персонаж получает способность призывать к себе участников группы.'] },
    13: { name: 'Эксперт Охоты', requiredPoints: 8, requiredLevel: 53, levels: ['Увеличивает урон по монстрам на 1%.','Увеличивает урон по монстрам на 2%.','Увеличивает урон по монстрам на 4%.'] },
    14: { name: 'Камни Стихий', requiredPoints: 8, requiredLevel: 53, levels: ['Увеличивает шанс выпадения Камней Стихий в Некрополях и Катакомбах на 15%.'] },
    15: { name: 'Двойная Удача', requiredPoints: 8, requiredLevel: 53, levels: ['При охоте на монстров, с них может выпасть вдвое больше останков: шанс 5%.','При охоте на монстров, с них может выпасть вдвое больше останков: шанс 10%.','При охоте на монстров, с них может выпасть вдвое больше останков: шанс 15%.'] },
    16: { name: 'Незаметное Движение', requiredPoints: 17, requiredLevel: 63, levels: ['Монстры не нападают на персонажа, пока действует этот эффект.'] },
    17: { name: 'Мастер Подземелий', requiredPoints: 17, requiredLevel: 63, levels: ['Увеличивает награду за прохождение подземелий: Одиночное подземелье на 1ед. Групповое подземелье на 2ед.','Увеличивает награду за прохождение подземелий: Одиночное подземелье на 3ед. Групповое подземелье на 5ед.'] },
    18: { name: 'Умиротворение', requiredPoints: 17, requiredLevel: 63, levels: ['Персонаж получает умение, отменяющее агрессию монстров.'] },
    19: { name: 'Запас Времени', requiredPoints: 17, requiredLevel: 63, levels: ['Увеличивает количество времени на Тематическую Охоту на 30мин.','Увеличивает количество времени на Тематическую Охоту на 60мин.'] },
    20: { name: 'Выгодная Сделка', requiredPoints: 27, requiredLevel: 73, levels: ['Увеличивает количество золота, получаемого при продаже предметов, добытых с трупов монстров, на 10%.'] }
  },

  siege: {
    0: { name: 'Боевой Опыт', levels: ['Персонаж получает Опыт и Сноровку за участие в военных действиях.'] },
    1: { name: 'Оборона', levels: ['Увеличивает Защиту от Охранников на 10%.','Увеличивает Защиту от Охранников на 25%.','Увеличивает Защиту от Охранников на 50%.'] },
    2: { name: 'Осадная Пушка', levels: ['Позволяет призывать Осадную Пушку на поле боя.'] },
    3: { name: 'Исцеление', levels: ['Персонаж получает способность исцелять свои раны.','Увеличивает силу исцеляющего заклинания.'] },
    4: { name: 'Осадный Урон', requiredPoints: 1, requiredLevel: 33, levels: ['Увеличивает осадный урон персонажа на 3%.','Увеличивает осадный урон персонажа на 6%.','Увеличивает осадный урон персонажа на 9%.'] },
    5: { name: 'Тактика Ведения Боя', requiredPoints: 1, requiredLevel: 33, requiredTalent:{index:1,level:3,name:'Оборона'}, levels: ['Увеличивает урон персонажа по охране на 10%.','Увеличивает урон персонажа по охране на 20%.','Увеличивает урон персонажа по охране на 30%.'] },
    6: { name: 'Улучшение Осадного Орудия', requiredPoints: 1, requiredLevel: 33, requiredTalent:{index:2,level:1,name:'Осадная Пушка'}, levels: ['Увеличивает защитные характеристики "Осадная Пушка" на 20%.','Увеличивает защитные характеристики "Осадная Пушка" на 40%.'] },
    7: { name: 'Резерв', requiredPoints: 1, requiredLevel: 33, levels: ['Персонаж теряет меньше славы при смерти от других персонажей на 10%.','Персонаж теряет меньше славы при смерти от других персонажей на 20%.'] },
    8: { name: 'Оборонительное Сооружение', requiredPoints: 1, requiredLevel: 43, levels: ['Позволяет призвать "Оборонительное Сооружение" на поле боя.'] },
    9: { name: 'Мародерство', requiredPoints: 3, requiredLevel: 43, requiredTalent:{index:5,level:3,name:'Тактика Ведения Боя'}, levels: ['Персонаж может получить Жалование за убийство Охраны.'] },
    10:{ name: 'Осадный Потенциал', requiredPoints: 3, requiredLevel: 43, requiredTalent:{index:6,level:2,name:'Улучшение Осадного Орудия'}, levels: ['Осадная пушка приносит больше жалования +3ед.','Осадная пушка приносит больше жалования +7ед.'] },
    11:{ name: 'Грабеж', requiredPoints: 3, requiredLevel: 43, levels: ['Персонаж получает умение, позволяющее вскрывать сундуки снабжения в городах.'] },
    12:{ name: 'Усиление Оборонительного Сооружения', requiredPoints: 8, requiredLevel: 53, requiredTalent:{index:8,level:1,name:'Оборонительное Сооружение'}, levels: ['Увеличивает защитные характеристики "Оборонительного Сооружения" на 25%.','Увеличивает защитные характеристики "Оборонительного Сооружения" на 50%.'] },
    13:{ name: 'Задания Аванпоста', requiredPoints: 8, requiredLevel: 53, levels: ['Персонаж получает бонус к награде, за выполнение заданий аванпоста +10%.','Персонаж получает бонус к награде, за выполнение заданий аванпоста +25%.'] },
    14:{ name: 'Защита Территорий', requiredPoints: 8, requiredLevel: 53, levels: ['Персонаж получает дополнительные характеристики, находясь на защите своего аванпоста +5%.','Персонаж получает дополнительные характеристики, находясь на защите своего аванпоста +10%.','Персонаж получает дополнительные характеристики, находясь на защите своего аванпоста +15%.'] },
    15:{ name: 'Взлом Замков', requiredPoints: 8, requiredLevel: 53, requiredTalent:{index:11,level:1,name:'Грабеж'}, levels: ['Увеличивает количество награбленного из ящиков снабжения. А так же увеличивает шанс успешной кражи.'] },
    16:{ name: 'Путь Войны', requiredPoints: 17, requiredLevel: 63, levels: ['Персонаж получает Жалование за убийство вражеских персонажей во время защиты своего аванпоста.'] },
    17:{ name: 'Награда за Военные Действия', requiredPoints: 17, requiredLevel: 63, levels: ['Увеличивает количество получаемого Жалования +5ед.'] },
    18:{ name: 'Механизм Контроля', requiredPoints: 17, requiredLevel: 63, levels: ['Позволяет призвать "Механизм Контроля" на поле боя.'] },
    19:{ name: 'Караван', requiredPoints: 17, requiredLevel: 63, levels: ['Сопровождение каравана становится выгоднее на 10%.','Сопровождение каравана становится выгоднее на 20%.'] },
    20:{ name: 'Укрепление', requiredPoints: 27, requiredLevel: 73, levels: ['Увеличивает защиту персонажа от массовых умений врагов на 10%.','Увеличивает защиту персонажа от массовых умений врагов на 20%.','Увеличивает защиту персонажа от массовых умений врагов на 30%.'] },
    21:{ name: 'К Бою Готов', requiredPoints: 27, requiredLevel: 73, levels: ['Увеличивает характеристики персонажа при военных действиях на крепости.'] }
  },
  smith: {
    0:{name:'Базовая Броня',levels:['Позволяет записывать рецепты БА Брони, в книгу рецептов, и создавать эти предметы.']},
    1:{name:'Базовое Оружие',levels:['Позволяет записывать рецепты БА Оружия, в книгу рецептов, и создавать эти предметы.']},
    2:{name:'Базовая Бижутерия',levels:['Позволяет записывать рецепты БА Бижутерии, в книгу рецептов, и создавать эти предметы.']},
    3:{name:'Переработка Сырья',levels:['Переработка ресурсов у кузнеца, становится выгоднее на 5%.','Переработка ресурсов у кузнеца, становится выгоднее на 10%.']},
    4:{name:'Эксперт Броня',requiredPoints:1,requiredLevel:33,levels:['Позволяет записывать рецепты EX Брони, в книгу рецептов, и создавать эти предметы.']},
    5:{name:'Эксперт Оружие',requiredPoints:1,requiredLevel:33,levels:['Позволяет записывать рецепты EX Оружия, в книгу рецептов, и создавать эти предметы.']},
    6:{name:'Эксперт Бижутерия',requiredPoints:1,requiredLevel:33,levels:['Позволяет записывать рецепты EX Бижутерии, в книгу рецептов, и создавать эти предметы.']},
    7:{name:'Дополнительные Карманы',requiredPoints:1,requiredLevel:33,levels:['Увеличивает грузоподъемность персонажа на 10%, и добавляет свободные ячейки в инвентаре +2 ячейки.','Увеличивает грузоподъемность персонажа на 20%, и добавляет свободные ячейки в инвентаре +5 ячеек.','Увеличивает грузоподъемность персонажа на 30%, и добавляет свободные ячейки в инвентаре +10 ячеек.']},
    8:{name:'Лавка Ремесленника',requiredPoints:3,requiredLevel:43,levels:['Увеличивает количество ячеек в лавке ремесленника +5 ячеек.','Увеличивает количество ячеек в лавке ремесленника +10 ячеек.','Увеличивает количество ячеек в лавке ремесленника +15 ячеек.']},
    9:{name:'Книга Рецептов',requiredPoints:3,requiredLevel:43,levels:['Увеличивает максимальное количество рецептов, которые можно записать в книге ремесленника +5ед.','Увеличивает максимальное количество рецептов, которые можно записать в книге ремесленника +10ед.','Увеличивает максимальное количество рецептов, которые можно записать в книге ремесленника +15ед.']},
    10:{name:'Обработка Материалов',requiredPoints:8,requiredLevel:43,levels:['Позволяет перерабатывать ресурсы, материалы более высокого качества, и изучать рецепты на x10 и x100 создание предметов.']},
    11:{name:'Элитная Броня',requiredPoints:8,requiredLevel:53,levels:['Позволяет записывать рецепты EL Брони, в книгу рецептов, и создавать эти предметы.']},
    12:{name:'Элитное Оружие',requiredPoints:8,requiredLevel:53,levels:['Позволяет записывать рецепты EL Оружия, в книгу рецептов, и создавать эти предметы.']},
    13:{name:'Элитная Бижутерия',requiredPoints:8,requiredLevel:53,levels:['Позволяет записывать рецепты EL Бижутерии, в книгу рецептов, и создавать эти предметы.']},
    14:{name:'Чертежник',requiredPoints:8,requiredLevel:53,levels:['Увеличивает шанс успешного создания рецепта кузнецом на 5%.','Увеличивает шанс успешного создания рецепта кузнецом на 10%.','Увеличивает шанс успешного создания рецепта кузнецом на 15%.']},
    15:{name:'Снижение Затрат',requiredPoints:17,requiredLevel:63,levels:['Уменьшает количество необходимых ресурсов для создания вещей на 1%.','Уменьшает количество необходимых ресурсов для создания вещей на 3%.','Уменьшает количество необходимых ресурсов для создания вещей на 5%.']},
    16:{name:'Опытный Ремесленник',requiredPoints:17,requiredLevel:63,levels:['Увеличивает шанс на успешное создание предметов +5%.','Увеличивает шанс на успешное создание предметов +10%.','Увеличивает шанс на успешное создание предметов +20%.','Увеличивает шанс на успешное создание предметов +30%.','Увеличивает шанс на успешное создание предметов +40%.']},
    17:{name:'Знание Материалов',requiredPoints:17,requiredLevel:63,levels:['Позволяет перерабатывать ресурсы: Сплав/Кристаллит/Древесина, выгоднее на 10%.']},
    18:{name:'Качественные Материалы',requiredPoints:17,requiredLevel:63,levels:['Позволяет перерабатывать ресурсы, в материалы высшего качества, и изучить рецепты на x10 и x100 создание предметов.']},
    19:{name:'Мастер Броня',requiredPoints:27,requiredLevel:73,levels:['Позволяет записывать рецепты MA Брони, в книгу рецептов, и создавать эти предметы.']},
    20:{name:'Мастер Оружие',requiredPoints:27,requiredLevel:73,levels:['Позволяет записывать рецепты MA Оружия, в книгу рецептов, и создавать эти предметы.']},
    21:{name:'Мастер Бижутерия',requiredPoints:27,requiredLevel:73,levels:['Позволяет записывать рецепты MA Бижутерии, в книгу рецептов, и создавать эти предметы.']},
    22:{name:'Закалка',requiredPoints:27,requiredLevel:73,levels:['Увеличивает шанс успешного зачарования экипировки на 1%.','Увеличивает шанс успешного зачарования экипировки на 2%.','Увеличивает шанс успешного зачарования экипировки на 3%.']}
  },
  alchemist: {
    0:{name:'Зельеварение',levels:['Персонаж может создавать Зелья низкого качества.']},
    1:{name:'Ботаника',levels:['Позволяет собирать травы без риска для здоровья.']},
    2:{name:'Настойки',levels:['При охоте на монстров с них могут появиться Настойки: Здоровья/Восполнения.','При охоте на монстров с них могут появиться Настойки: Здоровья/Восполнения/Охоты.','При охоте на монстров с них могут появиться Настойки: Здоровья/Восполнения/Охоты/Святости.']},
    3:{name:'Аперитив',levels:['Увеличивает время действия зелий маны и здоровья на 3 сек.']},
    4:{name:'Опытный Зельевар',requiredPoints:1,requiredLevel:33,requiredTalent:{index:0,level:1,name:'Зельеварение'},levels:['Персонаж может создавать слабые Эликсиры, и Зелья среднего качества.']},
    5:{name:'Редкая Находка',requiredPoints:1,requiredLevel:33,requiredTalent:{index:2,level:3,name:'Настойки'},levels:['Увеличивает шанс появления Настоек на 1%.','Увеличивает шанс появления Настоек на 2%.','Увеличивает шанс появления Настоек на 3%.','Увеличивает шанс появления Настоек на 4%.','Увеличивает шанс появления Настоек на 5%.']},
    6:{name:'Знаток Зельеварения',requiredPoints:3,requiredLevel:43,requiredTalent:{index:4,level:1,name:'Опытный Зельевар'},levels:['Персонаж может создавать средние Эликсиры и Зелья более высокого качества.']},
    7:{name:'Мастер Сбора Трав',requiredPoints:3,requiredLevel:43,levels:['Увеличивает количество собранных трав на 5%.','Увеличивает количество собранных трав на 10%.','Увеличивает количество собранных трав на 15%.']},
    8:{name:'Гербология',requiredPoints:3,requiredLevel:43,requiredTalent:{index:5,level:5,name:'Редкая Находка'},levels:['Повышает эффективность Настоек.']},
    9:{name:'Эффект Зелий',requiredPoints:3,requiredLevel:43,levels:['Персонаж получает способность, при которой эффективность зелий маны и здоровья увеличивается на 2.5%.','Персонаж получает способность, при которой эффективность зелий маны и здоровья увеличивается на 5%.','Персонаж получает способность, при которой эффективность зелий маны и здоровья увеличивается на 7.5%.','Персонаж получает способность, при которой эффективность зелий маны и здоровья увеличивается на 10%.']},
    10:{name:'Эксперт Зельеварения',requiredPoints:8,requiredLevel:53,requiredTalent:{index:6,level:1,name:'Знаток Зельеварения'},levels:['Персонаж может создавать Эликсиры и Зелья высокого качества.']},
    11:{name:'Эффективность Эликсиров',requiredPoints:8,requiredLevel:53,levels:['Время действия выпитого Эликсира увеличивается на 15мин.','Время действия выпитого Эликсира увеличивается на 30мин.','Время действия выпитого Эликсира увеличивается на 45мин.','Время действия выпитого Эликсира увеличивается на 60мин.']},
    12:{name:'Сумка Алхимика',requiredPoints:8,requiredLevel:53,requiredTalent:{index:8,level:1,name:'Гербология'},levels:['Некоторые Настойки собираются в инвентаре, и могут быть использованы в любой момент.']},
    13:{name:'Мастер Зельеварения',requiredPoints:17,requiredLevel:63,requiredTalent:{index:10,level:1,name:'Эксперт Зельеварения'},levels:['Персонаж может создавать Эликсиры и Зелья, совершенного качества.']},
    14:{name:'ВуншПунш',requiredPoints:17,requiredLevel:63,levels:['Сокращает время приготовления Эликсиров на 10%.','Сокращает время приготовления Эликсиров на 20%.','Сокращает время приготовления Эликсиров на 30%.','Сокращает время приготовления Эликсиров на 40%.','Сокращает время приготовления Эликсиров на 50%.']},
    15:{name:'Опытный Алхимик',requiredPoints:17,requiredLevel:63,requiredTalent:{index:12,level:1,name:'Сумка Алхимика'},levels:['На создание Эликсиров требуется меньше ресурсов -5%.','На создание Эликсиров требуется меньше ресурсов -10%.','На создание Эликсиров требуется меньше ресурсов -15%.']},
    16:{name:'Зелье Забвения',requiredPoints:17,requiredLevel:63,levels:['Персонаж может создавать "Зелье Забвения".']},
    17:{name:'Двойные Эликсиры',requiredPoints:27,requiredLevel:73,requiredTalent:{index:13,level:1,name:'Мастер Зельеварения'},levels:['При создании Эликсиров есть шанс 25%, увеличить количество произведенных Эликсиров.']},
    18:{name:'Бездонный Котел',requiredPoints:27,requiredLevel:73,levels:['Для создания Эликсиров и Зелей больше не требуется Вода.']},
    19:{name:'Создание Настоек',requiredPoints:27,requiredLevel:73,requiredTalent:{index:15,level:3,name:'Опытный Алхимик'},levels:['Персонаж получает возможность создавать Настойки.']}
  },
  gatherer: {
    0:{name:'Металлург',levels:['Персонаж получает навык добычи руды.']},
    1:{name:'Лесоруб',levels:['Персонаж получает навык рубки дерева.']},
    2:{name:'Горщик',levels:['Персонаж получает навык добычи кристаллов.']},
    3:{name:'Травничество',levels:['Персонаж получает навык сбора трав.']},
    4:{name:'Кованые Ресурсы',requiredPoints:1,requiredLevel:33,levels:['Персонаж может заколдовывать ресурсы.']},
    5:{name:'Шустрый Сборщик',requiredPoints:1,requiredLevel:33,levels:['После сбора ресурса персонаж получает эффект, увеличивающий скорость передвижения на 5ед.','После сбора ресурса персонаж получает эффект, увеличивающий скорость передвижения на 10ед.','После сбора ресурса персонаж получает эффект, увеличивающий скорость передвижения на 15ед.']},
    6:{name:'Быстрая Работа',requiredPoints:1,requiredLevel:33,levels:['Сокращает время перезарядки умения "Разделка", а также уменьшает количество добываемых ресурсов на 15%.']},
    7:{name:'Развитие',requiredPoints:1,requiredLevel:33,levels:['Персонаж получает на 10% больше опыта и сноровки при сборе ресурсов.','Персонаж получает на 20% больше опыта и сноровки при сборе ресурсов.','Персонаж получает на 30% больше опыта и сноровки при сборе ресурсов.']},
    8:{name:'Опытный Трудяга',requiredPoints:3,requiredLevel:43,levels:['Увеличивает количество добытой руды на 5%.','Увеличивает количество добытой руды на 10%.','Увеличивает количество добытой руды на 15%.']},
    9:{name:'Опытный Дровосек',requiredPoints:3,requiredLevel:43,levels:['Увеличивает количество добытого Сруба на 5%.','Увеличивает количество добытого Сруба на 10%.','Увеличивает количество добытого Сруба на 15%.']},
    10:{name:'Опытный Старатель',requiredPoints:3,requiredLevel:43,levels:['Увеличивает количество добытого Кристалла на 5%.','Увеличивает количество добытого Кристалла на 10%.','Увеличивает количество добытого Кристалла на 15%.']},
    11:{name:'Опытный Травник',requiredPoints:3,requiredLevel:43,levels:['Увеличивает количество собранных Трав на 5%.','Увеличивает количество собранных Трав на 10%.','Увеличивает количество собранных Трав на 15%.']},
    12:{name:'Бур',requiredPoints:8,requiredLevel:53,requiredTalent:{index:8,level:3,name:'Опытный Трудяга'},levels:['Персонаж получает возможность нанять Шахтера для добычи Руды/Кристалла. С определенных ресурсов: Крупное Месторождение Кристалла, Крупное Месторождение Руды.']},
    13:{name:'Лесопилка',requiredPoints:8,requiredLevel:53,requiredTalent:{index:9,level:3,name:'Опытный Дровосек'},levels:['Персонаж получает возможность нанять Дровосека для добычи Сруба. С определенных ресурсов: Липа, Береза Черная, Сейба, Ольха.']},
    14:{name:'Верхом на Коне',requiredPoints:8,requiredLevel:53,levels:['Особый навык, позволяющий собирать ресурсы на ездовом животном, но количество добываемых ресурсов будет снижено на 50%.']},
    15:{name:'Руки Загребуки',requiredPoints:8,requiredLevel:53,levels:['Увеличивает радиус сбора ресурсов при помощи зачарованной кирки, серпа, пилы и универсального инструмента на 5 метров.','Увеличивает радиус сбора ресурсов при помощи зачарованной кирки, серпа, пилы и универсального инструмента на 10 метров.','Увеличивает радиус сбора ресурсов при помощи зачарованной кирки, серпа, пилы и универсального инструмента на 15 метров.']},
    16:{name:'Сбор Добычи',requiredPoints:17,requiredLevel:63,levels:['Лесоруб и Шахтер приносят больше ресурсов, после смерти. На 10%.','Лесоруб и Шахтер приносят больше ресурсов, после смерти. На 20%.','Лесоруб и Шахтер приносят больше ресурсов, после смерти. На 30%.']},
    17:{name:'Качественная Разделка',requiredPoints:17,requiredLevel:63,levels:['При использовании умения «Разделка» из некоторых монстров, можно дополнительно добыть сруб, руду и кристаллы.']},
    18:{name:'Гужевая Повозка',requiredPoints:17,requiredLevel:63,requiredTalent:{index:14,level:1,name:'Верхом на Коне'},levels:['Особый навык, позволяющий собирать ресурсы на ездовом животном, но количество добываемых ресурсов будет снижено на 30%.']},
    19:{name:'Бездонный Рюкзак',requiredPoints:17,requiredLevel:63,requiredTalent:{index:15,level:3,name:'Руки Загребуки'},levels:['Увеличивает количество ячеек в инвентаре +15ед. и грузоподъемность на 25%.']},
    20:{name:'Верхом на Единороге',requiredPoints:27,requiredLevel:73,requiredTalent:{index:18,level:1,name:'Гужевая Повозка'},levels:['Особый навык, позволяющий собирать ресурсы на ездовом животном без штрафа.']}
  }

};

const state = new Map();
const grid = document.getElementById('talentGrid');
const grandTotal = document.getElementById('grandTotal');
const talentRemaining = document.getElementById('talentRemaining');
const tooltip = document.getElementById('talentTooltip');
const playerLevelInput = document.getElementById('playerLevel');
const buildNameInput = document.getElementById('buildName');
const buildErrorDialog = document.getElementById('buildErrorDialog');
let playerLevel = Number(playerLevelInput?.value || 1);

function talentPointLimit(level){
  const lvl = Math.max(1, Math.min(80, Number(level) || 1));
  if(lvl < 20) return 0;
  let points = 2;
  for(let currentLevel = 21; currentLevel <= lvl; currentLevel++){
    if(currentLevel % 10 === 0) points += 2;
    else if(currentLevel % 5 === 0) points += 3;
    else points += 1;
  }
  return Math.min(80, points);
}

function availableTalentPoints(){ return talentPointLimit(playerLevel); }
function remainingTalentPoints(){ return Math.max(0, availableTalentPoints() - allTotal()); }

function key(treeId, index){ return `${treeId}:${index}`; }
function current(treeId, index){ return state.get(key(treeId,index)) || 0; }
function totalFor(tree){ return tree.talents.reduce((sum, _t, i) => sum + current(tree.id,i), 0); }
function allTotal(){ return treeDefinitions.reduce((sum, tree) => sum + totalFor(tree), 0); }
function isComplete(tree, index){ return current(tree.id,index) >= tree.talents[index][2]; }
function incoming(tree,index){ return tree.links.filter(([,to]) => to === index).map(([from]) => from); }
function pointsAbove(tree,index){
  const row = tree.talents[index]?.[1] ?? 0;
  return tree.talents.reduce((sum,t,i) => sum + (t[1] < row ? current(tree.id,i) : 0), 0);
}
function requirementsMet(tree,index){
  const detail = detailFor(tree.id,index);
  if(!detail) return true;
  if(detail.requiredPoints != null && pointsAbove(tree,index) < detail.requiredPoints) return false;
  if(detail.requiredLevel != null && playerLevel < detail.requiredLevel) return false;
  if(detail.requiredTalent && current(tree.id,detail.requiredTalent.index) < detail.requiredTalent.level) return false;
  return true;
}
function isUnlocked(tree,index){
  const req=incoming(tree,index);
  return (!req.length || req.every(from => isComplete(tree,from))) && requirementsMet(tree,index);
}

function enforceDependencies(){
  let changed=true;
  while(changed){
    changed=false;
    for(const tree of treeDefinitions){
      for(let to=0; to<tree.talents.length; to++){
        if(!isUnlocked(tree,to) && current(tree.id,to)>0){ state.delete(key(tree.id,to)); changed=true; }
      }
    }
  }
}

function enforcePointLimit(){
  const limit = availableTalentPoints();
  if(allTotal() <= limit) return;
  // If the character level is lowered, remove points from the deepest talents first.
  // This keeps the build valid without asking the user to manually hunt for excess points.
  const candidates = [];
  for(const tree of treeDefinitions){
    tree.talents.forEach((talent,index) => candidates.push({tree,index,row:talent[1],col:talent[0]}));
  }
  candidates.sort((a,b) => b.row-a.row || b.index-a.index || b.col-a.col);
  while(allTotal() > limit){
    let removed = false;
    for(const item of candidates){
      const value = current(item.tree.id,item.index);
      if(value > 0){
        if(value === 1) state.delete(key(item.tree.id,item.index));
        else state.set(key(item.tree.id,item.index), value - 1);
        enforceDependencies();
        removed = true;
        if(allTotal() <= limit) break;
      }
    }
    if(!removed) break;
  }
}

function detailFor(treeId,index){ return talentDetails[treeId]?.[index] || null; }
function escapeHtml(value){ return String(value ?? '').replace(/[&<>\"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[ch])); }

function tooltipHtml(treeId,index){
  const detail = detailFor(treeId,index);
  if(!detail) return '';
  const value = current(treeId,index);
  const tree = treeDefinitions.find(t => t.id === treeId);
  const spentAbove = tree ? pointsAbove(tree,index) : 0;
  const reqLine = detail.requiredPoints != null || detail.requiredLevel != null
    ? `<div class="talent-tooltip-requirements">Необходимые очки : ${detail.requiredPoints != null ? `<b class="${spentAbove >= detail.requiredPoints ? 'is-met' : 'is-unmet'}">(${detail.requiredPoints}P)</b>` : ''}${detail.requiredPoints != null && detail.requiredLevel != null ? ' & ' : ''}${detail.requiredLevel != null ? `<b class="${playerLevel >= detail.requiredLevel ? 'is-met' : 'is-unmet'}">${detail.requiredLevel} Ур.</b>` : ''}</div>` : '';
  const talentReq = detail.requiredTalent
    ? `<div class="talent-tooltip-requirements">Необходимая способность : <b class="${current(treeId,detail.requiredTalent.index) >= detail.requiredTalent.level ? 'is-met' : 'is-unmet'}">${escapeHtml(detail.requiredTalent.name)} Ур${detail.requiredTalent.level}</b></div>` : '';
  return `<div class="talent-tooltip-title">${escapeHtml(detail.name)}</div>${reqLine}${talentReq}<div class="talent-tooltip-body">${detail.levels.map((text,levelIndex) => {
    const level = levelIndex + 1;
    const active = value === level;
    return `<div class="talent-tooltip-level ${active ? 'is-current' : ''}"><div class="talent-tooltip-level-label">Ур${level}</div><div>${escapeHtml(text)}</div></div>`;
  }).join('')}</div>`;
}

function placeTooltip(event){
  if(!tooltip || tooltip.hidden) return;
  const pad = 12;
  const gap = 14;
  const rect = tooltip.getBoundingClientRect();
  let left = event.clientX + gap;
  let top = event.clientY + gap;
  if(left + rect.width + pad > window.innerWidth) left = Math.max(pad,event.clientX - rect.width - gap);
  if(top + rect.height + pad > window.innerHeight) top = Math.max(pad,event.clientY - rect.height - gap);
  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${top}px`;
}

function showTooltip(button,event){
  if(!tooltip || !button) return;
  const treeId = button.dataset.tree;
  const index = Number(button.dataset.index);
  const html = tooltipHtml(treeId,index);
  if(!html){ tooltip.hidden = true; return; }
  tooltip.innerHTML = html;
  tooltip.hidden = false;
  placeTooltip(event);
}


function serializeBuild(){
  const trees = {};
  for(const tree of treeDefinitions){
    trees[tree.id] = tree.talents.map((_t,index) => current(tree.id,index));
  }
  return {
    format:'odium-world-talent-build',
    version:1,
    name:String(buildNameInput?.value || '').trim() || 'Мой билд',
    playerLevel,
    trees
  };
}
function showBuildError(){
  if(buildErrorDialog?.showModal) buildErrorDialog.showModal();
  else alert('Невозможно загрузить билд');
}
function validateAndApplyBuild(payload){
  if(!payload || payload.format !== 'odium-world-talent-build' || payload.version !== 1) throw new Error('bad format');
  const lvl = Number(payload.playerLevel);
  if(!Number.isInteger(lvl) || lvl < 1 || lvl > 80 || !payload.trees || typeof payload.trees !== 'object') throw new Error('bad data');
  const candidate = new Map();
  for(const tree of treeDefinitions){
    const values = payload.trees[tree.id];
    if(!Array.isArray(values) || values.length !== tree.talents.length) throw new Error('bad tree');
    values.forEach((raw,index) => {
      const value = Number(raw);
      const max = tree.talents[index][2];
      if(!Number.isInteger(value) || value < 0 || value > max) throw new Error('bad value');
      if(value) candidate.set(key(tree.id,index),value);
    });
  }
  const previous = new Map(state);
  const previousLevel = playerLevel;
  state.clear();
  for(const [k,v] of candidate) state.set(k,v);
  playerLevel = lvl;
  try{
    if(allTotal() > availableTalentPoints()) throw new Error('point limit');
    for(const tree of treeDefinitions){
      tree.talents.forEach((_t,index) => { if(current(tree.id,index)>0 && !isUnlocked(tree,index)) throw new Error('requirements'); });
    }
  }catch(error){
    state.clear(); for(const [k,v] of previous) state.set(k,v); playerLevel = previousLevel; throw error;
  }
  if(playerLevelInput) playerLevelInput.value = String(playerLevel);
  if(buildNameInput) buildNameInput.value = typeof payload.name === 'string' ? payload.name.slice(0,80) : '';
  render();
}

function render(){
  grid.innerHTML = treeDefinitions.map(tree => {
    const links = tree.links.map(([from,to]) => {
      const [fromCol,fromRow] = tree.talents[from];
      const [toCol,toRow] = tree.talents[to];
      if(fromCol !== toCol || toRow <= fromRow) return '';
      const active = isComplete(tree,from);
      return `<div class="talent-link ${active ? 'is-active' : ''}" style="--col:${fromCol};--from:${fromRow};--to:${toRow}" aria-hidden="true"><i></i><i></i><i></i></div>`;
    }).join('');

    const talents = tree.talents.map(([col,row,max], index) => {
      const value = current(tree.id,index);
      const complete = value >= max;
      const unlocked = isUnlocked(tree,index);
      const detail = detailFor(tree.id,index);
      const label = detail?.name || `талант ${index+1}`;
      return `<button class="talent-node ${value ? 'is-leveled' : ''} ${complete ? 'is-complete' : ''} ${unlocked ? '' : 'is-locked'}"
        style="--col:${col};--row:${row};--icon:url('assets/talents/${tree.id}-${String(index).padStart(2,'0')}.png')"
        data-tree="${tree.id}" data-index="${index}" ${unlocked ? '' : 'disabled'} aria-label="${tree.name}: ${escapeHtml(label)}, ${value} из ${max}">
        <span class="talent-symbol" aria-hidden="true"></span>
        <span class="talent-rank">${value}/${max}</span>
      </button>`;
    }).join('');

    return `<article class="talent-tree talent-theme-${tree.theme}">
      <header class="talent-tree-head"><div class="talent-tree-title"><span>${tree.emblem}</span><strong>${tree.name}</strong></div><div class="talent-tree-points">${totalFor(tree)} P</div></header>
      <div class="talent-tree-body"><div class="talent-watermark">${tree.emblem}</div><div class="talent-nodes">${links}${talents}</div></div>
    </article>`;
  }).join('');
  const limit = availableTalentPoints();
  const spent = allTotal();
  grandTotal.textContent = `${spent} / ${limit} P`;
  if(talentRemaining) talentRemaining.textContent = `Доступно: ${Math.max(0, limit - spent)}`;
}

grid.addEventListener('pointerover', event => {
  const button = event.target.closest('.talent-node');
  if(button) showTooltip(button,event);
});
grid.addEventListener('pointermove', event => {
  const button = event.target.closest('.talent-node');
  if(button && detailFor(button.dataset.tree,Number(button.dataset.index))) {
    if(tooltip.hidden) showTooltip(button,event); else placeTooltip(event);
  }
});
grid.addEventListener('pointerout', event => {
  const button = event.target.closest('.talent-node');
  if(!button || button.contains(event.relatedTarget)) return;
  if(tooltip) tooltip.hidden = true;
});

grid.addEventListener('click', event => {
  const button = event.target.closest('.talent-node');
  if (!button || button.disabled) return;
  const treeId = button.dataset.tree;
  const index = Number(button.dataset.index);
  const tree = treeDefinitions.find(t => t.id === treeId);
  if (!tree || !Number.isInteger(index) || !tree.talents[index]) return;
  const max = tree.talents[index][2];
  const value = current(treeId,index);
  if (value < max && allTotal() < availableTalentPoints()) state.set(key(treeId,index), value + 1);
  if(tooltip) tooltip.hidden = true;
  render();
});

grid.addEventListener('contextmenu', event => {
  const button = event.target.closest('.talent-node');
  if (!button) return;
  event.preventDefault();
  const treeId = button.dataset.tree;
  const index = Number(button.dataset.index);
  const value = current(treeId,index);
  if (value > 0) state.set(key(treeId,index), value - 1);
  enforceDependencies();
  if(tooltip) tooltip.hidden = true;
  render();
});

if(playerLevelInput){
  const applyPlayerLevel = () => {
    const next = Math.max(1, Math.min(80, Number(playerLevelInput.value) || playerLevel || 1));
    playerLevel = next;
    playerLevelInput.value = String(next);
    enforceDependencies();
    if(allTotal() > availableTalentPoints()) enforcePointLimit();
    if(tooltip) tooltip.hidden = true;
    render();
  };
  playerLevelInput.addEventListener('change', applyPlayerLevel);
  playerLevelInput.addEventListener('keydown', event => {
    if(event.key === 'Enter'){ event.preventDefault(); playerLevelInput.blur(); }
  });
}

document.getElementById('resetTalents').addEventListener('click', () => { state.clear(); render(); });

document.getElementById('saveTalentBuild')?.addEventListener('click', async () => {
  if(!window.odiumApp?.saveTalentBuild) return;
  const payload = serializeBuild();
  const result = await window.odiumApp.saveTalentBuild(payload);
  if(result?.ok && buildNameInput) buildNameInput.value = payload.name;
});

document.getElementById('importTalentBuild')?.addEventListener('click', async () => {
  if(!window.odiumApp?.importTalentBuild) return;
  const result = await window.odiumApp.importTalentBuild();
  if(result?.canceled) return;
  if(!result?.ok){ showBuildError(); return; }
  try{ validateAndApplyBuild(JSON.parse(result.content)); }
  catch{ showBuildError(); }
});

document.getElementById('menuButton').addEventListener('click', async () => {
  if (window.odiumApp?.goToMenu) { const ok = await window.odiumApp.goToMenu(); if (ok) return; }
  location.href = 'index.html';
});
render();
