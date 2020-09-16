CREATE DATABASE foodfy;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    is_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT(NOW()),
    updated_at TIMESTAMP DEFAULT(NOW()),
    reset_token TEXT,
    reset_token_expires TEXT
);

CREATE TABLE chefs (
    id SERIAL PRIMARY KEY,
    name TEXT,
    created_at TIMESTAMP DEFAULT (NOW())
);

CREATE TABLE recipes (
    id SERIAL PRIMARY KEY,
    title TEXT,
    ingredients TEXT [],
    preparation TEXT [],
    information TEXT,
    created_at TIMESTAMP DEFAULT (NOW()),
    updated_at TIMESTAMP DEFAULT (NOW()),
    chef_id INTEGER,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE files (
    id SERIAL PRIMARY KEY,
    name TEXT,
    path TEXT NOT NULL
);

CREATE TABLE chef_files (
    id SERIAL PRIMARY KEY,
    chef_id INTEGER REFERENCES chefs(id) ON DELETE CASCADE,
    file_id INTEGER REFERENCES files(id)
);

CREATE TABLE recipe_files (
    id SERIAL PRIMARY KEY,
    recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
    file_id INTEGER REFERENCES files(id)
);

CREATE TABLE "session" (
    "sid" varchar NOT NULL COLLATE "default",
    "sess" json NOT NULL,
    "expire" timestamp(6) NOT NULL
) WITH (OIDS=FALSE);

ALTER TABLE "session"
ADD CONSTRAINT "session_pkey"
PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON recipes
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- Password: 123
INSERT INTO users (name, email, password, is_admin, created_at, updated_at) VALUES
('Admin', 'admin@email.com', '$2a$08$vNW2HvAZSUFLOMyfXr.rEu8KsNvohtB3RdCzjH/rZY4.aavEWngL6', true, '2020-01-03 00:00:00', '2020-01-03 00:00:00'),
('User', 'user@email.com', '$2a$08$vNW2HvAZSUFLOMyfXr.rEu8KsNvohtB3RdCzjH/rZY4.aavEWngL6', false, '2020-01-04 00:00:00', '2020-01-04 00:00:00');

INSERT INTO files (name, path) VALUES
('jorge-relato.jpg', 'public\images\jorge-relato.jpg'),
('fabiana-melo.jpg', 'public\images\fabiana-melo.jpg'),
('vania-steroski.jpg', 'public\images\vania-steroski.jpg'),
('juliano-vieira.jpg', 'public\images\juliano-vieira.jpg'),
('julia-kinoto.jpg', 'public\images\julia-kinoto.jpg'),
('ricardo-gouvea.jpg', 'public\images\ricardo-gouvea.jpg'),
('burger01.jpg', 'public\images\burger01.jpg'),
('burger02.jpg', 'public\images\burger02.jpg'),
('burger03.jpg', 'public\images\burger03.jpg'),
('pizza01.jpg', 'public\images\pizza01.jpg'),
('pizza02.jpg', 'public\images\pizza02.jpg'),
('pizza03.jpg', 'public\images\pizza03.jpg'),
('asinhas01.jpg', 'public\images\asinhas01.jpg'),
('asinhas02.jpg', 'public\images\asinhas02.jpg'),
('asinhas03.jpg', 'public\images\asinhas03.jpg'),
('lasanha01.jpg', 'public\images\lasanha01.jpg'),
('lasanha02.jpg', 'public\images\lasanha02.jpg'),
('lasanha03.jpg', 'public\images\lasanha03.jpg'),
('espaguete01.jpg', 'public\images\espaguete01.jpg'),
('espaguete02.jpg', 'public\images\espaguete02.jpg'),
('espaguete03.jpg', 'public\images\espaguete03.jpg'),
('docinhos01.jpg', 'public\images\docinhos01.jpg'),
('docinhos02.jpg', 'public\images\docinhos02.jpg'),
('docinhos03.jpg', 'public\images\docinhos03.jpg');

INSERT INTO chefs (name, created_at) VALUES
('Jorge Relato', '2020-01-05 00:00:00'),
('Fabiana Melo', '2020-01-26 00:00:00'),
('Vania Steroski', '2020-02-10 00:00:00'),
('Juliano Vieira', '2020-02-14 00:00:00'),
('Júlia Kinoto', '2020-02-23 00:00:00'),
('Ricardo Gouvea', '2020-03-03 00:00:00');

INSERT INTO recipes (title, ingredients, preparation, information, created_at, updated_at, chef_id, user_id) VALUES
('Triplo bacon burger', '{"3 kg de carne moída (escolha uma carne magra e macia)","300 g de bacon moído","1 ovo","3 colheres (sopa) de farinha de trigo","3 colheres (sopa) de tempero caseiro: feito com alho, sal, cebola, pimenta e cheiro verde processados no liquidificador","30 ml de água gelada"}', '{"Misture todos os ingredientes muito bem e amasse para que fique tudo muito bem misturado.","Faça porções de 90 g a 100 g.","Forre um plástico molhado em uma bancada e modele os hambúrgueres utilizando um aro como base.","Faça um de cada vez e retire o aro logo em seguida.","Forre uma assadeira de metal com plástico, coloque os hambúrgueres e intercale camadas de carne e plásticos (sem apertar).","Faça no máximo 4 camadas por forma e leve para congelar.","Retire do congelador, frite ou asse e está pronto."}', 'Preaqueça a chapa, frigideira ou grelha por 10 minutos antes de levar os hambúrgueres. Adicione um pouquinho de óleo ou manteiga e não amasse os hambúrgueres! \n\n Você sabia que a receita que precede o hambúrguer surgiu no século XIII, na Europa? A ideia de moer a carne chegou em Hamburgo no século XVII, onde um açogueiro resolveu também temperá-la. Assim, a receita foi disseminada nos Estados Unidos por alemães da região. Lá surgiu a ideia de colocar o hambúrguer no meio do pão e adicionar outros ingredientes, como queijo, tomates e alface.', '2020-01-06 00:00:00', '2020-01-06 00:00:00', 1, 2),
('Pizza 4 estações', '{"1 xícara (chá) de leite","1 ovo","1 colher (chá) de sal","1 colher (chá) de açúcar","1 colher (sopa) de margarina","1 e 1/2 xícara (chá) de farinha de trigo","1 colher (sobremesa) de fermento em pó","1/2 lata de molho de tomate","250 g de mussarela ralada grossa","2 tomates fatiados","Azeitona picada","Orégano a gosto"}', '{"No liquidificador bata o leite, o ovo, o sal, o açúcar, a margarina, a farinha de trigo e o fermento em pó até que tudo esteja encorporado.","Despeje a massa em uma assadeira para pizza untada com margarina e leve ao forno preaquecido por 20 minutos.","Retire do forno e despeje o molho de tomate.","Cubra a massa com mussarela ralada, tomate e orégano a gosto.","Leve novamente ao forno até derreter a mussarela."}', 'Pizza de liquidificador é uma receita deliciosa e supersimples de preparar. Feita toda no liquidificador, ela é bem prática para o dia a dia. Aqui no TudoGostoso você também encontra diversas delícias práticas feitas no liquidificador: massa de panqueca, torta de frango de liquidificador, pão de queijo de liquidificador, bolo de banana, bolo de chocolate e muito mais!', '2020-01-27 00:00:00', '2020-01-27 00:00:00', 2, 2),
('Asinhas de frango ao barbecue', '{"12 encontros de asinha de galinha, temperados a gosto","2 colheres de sopa de farinha de trigo","1/2 xícara (chá) de óleo","1 xícara de molho barbecue"}', '{"Em uma tigela coloque o encontro de asinha de galinha e polvilhe a farinha de trigo e misture com as mãos.","Em uma frigideira ou assador coloque o óleo quando estiver quente frite até ficarem douradas.","Para servir fica bonito com salada, ou abuse da criatividade."}', 'Informações adicionais', '2020-02-11 00:00:00', '2020-02-11 00:00:00', 3, 2),
('Lasanha mac n cheese', '{"Massa pronta de lasanha","400 g de presunto","400 g de mussarela ralada","2 copos de requeijão","150 g de mussarela para gratinar"}', '{"Em uma panela, coloque a manteiga para derreter.","Acrescente a farinha de trigo e misture bem com auxílio de um fouet.","Adicione o leite e misture até formar um creme homogêneo.","Tempere com sal, pimenta e noz-moscada a gosto.","Desligue o fogo e acrescente o creme de leite; misture bem e reserve."}', 'Recheie a lasanha com o que preferir.', '2020-02-15 00:00:00', '2020-02-15 00:00:00', 4, 2),
('Espaguete ao alho', '{"1 pacote de macarrão 500 g (tipo do macarrão a gosto)","1 saquinho de alho granulado","1/2 tablete de manteiga (não use margarina)","1 colher (sopa) de azeite extra virgem","Ervas (manjericão, orégano, salsa, cebolinha, tomilho, a gosto)","Sal","1 dente de alho","Gengibre em pó a gosto","1 folha de louro"}', '{"Quando faltar mais ou menos 5 minutos para ficar no ponto de escorrer o macarrão, comece o preparo da receita.","Na frigideira quente coloque a manteiga, o azeite, a folha de louro, e o alho granulado.","Nesta hora um pouco de agilidade, pois o macarrão escorrido vai para a frigideira, sendo mexido e dosado com sal a gosto, as ervas, o gengibre em pó a gosto também.","O dente de alho, serve para você untar os pratos onde serão servidos o macarrão.","Coloque as porções nos pratos já com o cheiro do alho, e enfeite com algumas ervas."}', 'Não lave o macarrão nem passe óleo ou gordura nele depois de escorrê-lo. Coloque direto na frigideira.', '2020-02-24 00:00:00', '2020-02-24 00:00:00', 5, 2),
('Docinhos pão-do-céu', '{"1 kg de batata-doce","100 g de manteiga","3 ovos","1 pacote de coco seco ralado (100 g)","3 colheres (sopa) de açúcar 1 lata de Leite Moça","1 colher (sopa) de fermento em pó","Manteiga para untar","Açúcar de confeiteiro"}', '{"Cozinhe a batata-doce numa panela de pressão, com meio litro de água, por cerca de 20 minutos. Descasque e passe pelo espremedor, ainda quente.","Junte a manteiga, os ovos, o coco ralado, o açúcar, o Leite Moça e o fermento em pó, mexendo bem após cada adição.","Despeje em assadeira retangular média, untada e leve ao forno médio (180°C), por aproximadamente 45 minutos. Depois de frio, polvilhe, com o açúcar de confeiteiro e corte em quadrados."}', 'Informações adicionais', '2020-03-04 00:00:00', '2020-03-04 00:00:00', 6, 2);

INSERT INTO chef_files (chef_id, file_id) VALUES
(1, 1), (2, 2), (3, 3), (4, 4), (5, 5), (6, 6);

INSERT INTO recipe_files (recipe_id, file_id) VALUES
(1, 7), (1, 8), (1, 9),
(2, 10), (2, 11), (2, 12),
(3, 13), (3, 14), (3, 15),
(4, 16), (4, 17), (4, 18),
(5, 19), (5, 20), (5, 21),
(6, 22), (6, 23), (6, 24);