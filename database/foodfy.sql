CREATE DATABASE foodfy;

CREATE TABLE chefs (
    id SERIAL PRIMARY KEY,
    name text,
    avatar_url text,
    created_at timestamp without time zone
);

CREATE TABLE recipes (
    id SERIAL PRIMARY KEY,
    title text,
    image text,
    ingredients text [],
    preparation text [],
    information text,
    created_at timestamp without time zone,
    chef_id integer
);

INSERT INTO chefs (name, avatar_url, created_at) VALUES
('Jorge Relato', 'https://source.unsplash.com/6YQmQgcQ0VA', '2020-06-29 00:00:00'),
('Fabiana Melo', 'https://source.unsplash.com/xe68QiMaDrQ', '2020-06-29 00:00:00'),
('Vania Steroski', 'https://source.unsplash.com/ff5K3-kYPHA', '2020-06-29 00:00:00'),
('Juliano Vieira', 'https://source.unsplash.com/WNoLnJo7tS8', '2020-06-29 00:00:00'),
('Júlia Kinoto', 'https://source.unsplash.com/tNCH0sKSZbA', '2020-06-29 00:00:00'),
('Ricardo Golvea', 'https://source.unsplash.com/2t-ydzD385M', '2020-06-29 00:00:00'),
( 'Alberto Silva', 'https://source.unsplash.com/WNoLnJo7tS8', '2020-06-30 00:00:00');

INSERT INTO recipes (title, image, ingredients, preparation, information, created_at, chef_id) VALUES
('Asinhas de frango ao barbecue', 'https://source.unsplash.com/zNqArwc7Hh4', '{"12 encontros de asinha de galinha, temperados a gosto","2 colheres de sopa de farinha de trigo","1/2 xícara (chá) de óleo","1 xícara de molho barbecue"}', '{"Em uma tigela coloque o encontro de asinha de galinha e polvilhe a farinha de trigo e misture com as mãos.","Em uma frigideira ou assador coloque o óleo quando estiver quente frite até ficarem douradas.","Para servir fica bonito com salada, ou abuse da criatividade."}', 'Informações adicionais', '2020-06-29 00:00:00', 3),
('Triplo bacon burger', 'https://source.unsplash.com/_qxbJUr9RqI', '{"3 kg de carne moída (escolha uma carne magra e macia)","300 g de bacon moído","1 ovo","3 colheres (sopa) de farinha de trigo","3 colheres (sopa) de tempero caseiro: feito com alho, sal, cebola, pimenta e cheiro verde processados no liquidificador","30 ml de água gelada"}', '{"Misture todos os ingredientes muito bem e amasse para que fique tudo muito bem misturado.","Faça porções de 90 g a 100 g.","Forre um plástico molhado em uma bancada e modele os hambúrgueres utilizando um aro como base.","Faça um de cada vez e retire o aro logo em seguida.","Forre uma assadeira de metal com plástico, coloque os hambúrgueres e intercale camadas de carne e plásticos (sem apertar).","Faça no máximo 4 camadas por forma e leve para congelar.","Retire do congelador, frite ou asse e está pronto."}', 'Preaqueça a chapa, frigideira ou grelha por 10 minutos antes de levar os hambúrgueres. Adicione um pouquinho de óleo ou manteiga e não amasse os hambúrgueres! \n\n Você sabia que a receita que precede o hambúrguer surgiu no século XIII, na Europa? A ideia de moer a carne chegou em Hamburgo no século XVII, onde um açogueiro resolveu também temperá-la. Assim, a receita foi disseminada nos Estados Unidos por alemães da região. Lá surgiu a ideia de colocar o hambúrguer no meio do pão e adicionar outros ingredientes, como queijo, tomates e alface.', '2020-06-29 00:00:00', 1),
('Pizza 4 estações', 'https://source.unsplash.com/MQUqbmszGGM', '{"1 xícara (chá) de leite","1 ovo","1 colher (chá) de sal","1 colher (chá) de açúcar","1 colher (sopa) de margarina","1 e 1/2 xícara (chá) de farinha de trigo","1 colher (sobremesa) de fermento em pó","1/2 lata de molho de tomate","250 g de mussarela ralada grossa","2 tomates fatiados","Azeitona picada","Orégano a gosto"}', '{"No liquidificador bata o leite, o ovo, o sal, o açúcar, a margarina, a farinha de trigo e o fermento em pó até que tudo esteja encorporado.","Despeje a massa em uma assadeira para pizza untada com margarina e leve ao forno preaquecido por 20 minutos.","Retire do forno e despeje o molho de tomate.","Cubra a massa com mussarela ralada, tomate e orégano a gosto.","Leve novamente ao forno até derreter a mussarela."}', 'Pizza de liquidificador é uma receita deliciosa e supersimples de preparar. Feita toda no liquidificador, ela é bem prática para o dia a dia. Aqui no TudoGostoso você também encontra diversas delícias práticas feitas no liquidificador: massa de panqueca, torta de frango de liquidificador, pão de queijo de liquidificador, bolo de banana, bolo de chocolate e muito mais!', '2020-06-29 00:00:00', 2),
('Lasanha mac n cheese', 'https://source.unsplash.com/q5C-_coAZR4', '{"Massa pronta de lasanha","400 g de presunto","400 g de mussarela ralada","2 copos de requeijão","150 g de mussarela para gratinar"}', '{"Em uma panela, coloque a manteiga para derreter.","Acrescente a farinha de trigo e misture bem com auxílio de um fouet.","Adicione o leite e misture até formar um creme homogêneo.","Tempere com sal, pimenta e noz-moscada a gosto.","Desligue o fogo e acrescente o creme de leite; misture bem e reserve."}', 'Recheie a lasanha com o que preferir.', '2020-06-29 00:00:00', 4),
('Espaguete ao alho', 'https://source.unsplash.com/b29Qdj7zc5g', '{"1 pacote de macarrão 500 g (tipo do macarrão a gosto)","1 saquinho de alho granulado","1/2 tablete de manteiga (não use margarina)","1 colher (sopa) de azeite extra virgem","Ervas (manjericão, orégano, salsa, cebolinha, tomilho, a gosto)",Sal,"1 dente de alho","Gengibre em pó a gosto","1 folha de louro"}', '{"Quando faltar mais ou menos 5 minutos para ficar no ponto de escorrer o macarrão, comece o preparo da receita.","Na frigideira quente coloque a manteiga, o azeite, a folha de louro, e o alho granulado.","Nesta hora um pouco de agilidade, pois o macarrão escorrido vai para a frigideira, sendo mexido e dosado com sal a gosto, as ervas, o gengibre em pó a gosto também.","O dente de alho, serve para você untar os pratos onde serão servidos o macarrão.","Coloque as porções nos pratos já com o cheiro do alho, e enfeite com algumas ervas."}', 'Não lave o macarrão nem passe óleo ou gordura nele depois de escorrê-lo. Coloque direto na frigideira.', '2020-06-29 00:00:00', 5),
('Docinhos pão-do-céu', 'https://source.unsplash.com/cSzyY2UaFSI', '{"1 kg de batata-doce","100 g de manteiga","3 ovos","1 pacote de coco seco ralado (100 g)","3 colheres (sopa) de açúcar 1 lata de Leite Moça","1 colher (sopa) de fermento em pó","Manteiga para untar","Açúcar de confeiteiro"}', '{"Cozinhe a batata-doce numa panela de pressão, com meio litro de água, por cerca de 20 minutos. Descasque e passe pelo espremedor, ainda quente.","Junte a manteiga, os ovos, o coco ralado, o açúcar, o Leite Moça e o fermento em pó, mexendo bem após cada adição.","Despeje em assadeira retangular média, untada e leve ao forno médio (180°C), por aproximadamente 45 minutos. Depois de frio, polvilhe, com o açúcar de confeiteiro e corte em quadrados."}', 'Informações adicionais', '2020-06-29 00:00:00', 6);