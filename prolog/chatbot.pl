% Helper Predicate
% *******************************************************
% Convert a list of strings to a list of lowercase atoms
strings_to_lower_atoms([], []).
strings_to_lower_atoms([String|Strings], [Atom|Atoms]) :-
    string_lower(String, LowerString),
    atom_string(Atom, LowerString),
    strings_to_lower_atoms(Strings, Atoms).

% Response Predicate
% **************************************************
response(InputStrings) :-
    strings_to_lower_atoms(InputStrings, InputAtoms),
    (phrase(sentence(Classification, Person, Action), InputAtoms) ->
        (
            % Parsing succeeded
            generate_response(Classification, Person, Action)
        )
    ;
        (
            % Parsing failed
            writeln('No matching sentence rule found.'),
            generate_response(_, _, _)
        )
    ).

% Grammar Rules
% **********************************
% Sentence structures
sentence(greeting_action, Person, Action) --> greeting, personalPronoun(Person), verb(Person), hitWord(Action).
sentence(greeting_action_adjective, Person, _) --> greeting, verb(Person), personalPronoun(Person), adjective(Person).
sentence(greeting_action_double_verb, Person, _) --> greeting, personalPronoun(Person), verb(Person), verb(Person).
sentence(greeting_noun, Person, _) --> greeting, personalPronoun(Person), verb(Person), noun.
sentence(greeting_determiner_noun, Person, _) --> greeting, verb(Person), determiner, noun.
sentence(greeting_adjective, Person, _) --> greeting, verb(Person), personalPronoun(Person), adjective(Person).
sentence(greeting_aux_verb, Person, _) --> greeting, auxiliaryWord, personalPronoun(Person), verb(Person).
sentence(greeting_aux_hitword, Person, Action) --> greeting, auxiliaryWord, personalPronoun(Person), hitWord(Action).
sentence(short_greeting_action, Person, Action) --> greeting, personalPronoun(Person), hitWord(Action).
sentence(greeting_action_adjective, Person, _) --> greeting, verb(Person), personalPronoun(Person), adjective(Person).
sentence(question_action, Person, Action) --> questionWord, auxiliaryWord(Person), personalPronoun(Person), verb(Action).
sentence(question_action, Person, Action) --> questionWord, auxiliaryWord, personalPronoun(Person), verb(Action).
sentence(action_only, _, Action) --> hitWord(Action).

% greet your new god ************************************
greeting --> [hi].
greeting --> [hallo].
greeting --> [howdy].
greeting --> [moin].
greeting --> [guten, tag].
greeting --> [morgen].
greeting --> [hello].


% questions are never dumb ******************************
questionWord --> [how].
questionWord --> [where].

% pronouns and names *******************************
personalPronoun(user) --> [i].
personalPronoun(bot) --> [you].
personalPronoun(bot) --> [computer].
personalPronoun(bot) --> [chatbot].
personalPronoun(bot) --> [robot].

% verbs make the world go round
verb(user) --> [want, to].
verb(user) --> [need, to].
verb(user) --> [need].
verb(user) --> [help].
verb(user) --> [create].
verb(user) --> [login].
verb(user) --> [register].
verb(user) --> [reset].
verb(user) --> [want].
verb(user) --> [do].
verb(bot) --> [do].
verb(bot) --> [function].
verb(bot) --> [are].
verb(register) --> [register].
verb(login) --> [login].
verb(post) --> [post].
verb(reset) --> [reset].
verb(comment) --> [comment].

% Nouns ***************************************************
noun --> [creator]. %do not forget that!
noun --> [intelligence].

% Determiner ****************************************
determiner --> [a].
determiner --> [the].

% Auxiliary Words are not known by talahons *************************************+
auxiliaryWord --> [can].
auxiliaryWord --> [must].
auxiliaryWord(user) --> [can].
auxiliaryWord(user) --> [do].
auxiliaryWord(bot) --> [can].
auxiliaryWord(bot) --> [do].


% Hit Words (Actions) ********************************************
hitWord(help) --> [help].
hitWord(comment) --> [comment].
hitWord(comments) --> [comments].
hitWord(post) --> [post].
hitWord(posts) --> [posts].
hitWord(register) --> [register].
hitWord(again) --> [again].
hitWord(repeat) --> [repeat].
hitWord(last_answer) --> [last, answer].

% Adjectives **********************************************
adjective(bot) --> [intelligent].
adjective(bot) --> [dumb].
adjective(bot) --> [creative].
adjective(bot) --> [evil].
adjective(bot) --> [artificial].

% Response Generation
% **************************************************
generate_response(Classification, Person, Action) :-
    nonvar(Classification), nonvar(Person), nonvar(Action),
    Classification == greeting_action,
    Person == user,
    Action == comment,
    !,
    write("I am assuming that you are logged in.\nClick on the post you want to comment. A modal will open up where you can start typing.").

generate_response(Classification, Person, Action) :-
    nonvar(Classification), nonvar(Person), nonvar(Action),
    Classification == greeting_action,
    Person == user,
    Action == post,
    !,
    write("On the Feed, just click on the button 'make new bond'!").

generate_response(Classification, Person, Action) :-
    nonvar(Classification), nonvar(Person), nonvar(Action),
    Classification == greeting_action,
    Person == user,
    Action == posts,
    !,
    write("On the Feed, just click on the button 'make new bond'!").
generate_response(Classification, Person, Action) :-
    nonvar(Classification), nonvar(Person), nonvar(Action),
    Classification == greeting_action,
    Person == user,
    Action == register,
    !,
    write("On the login page, there is a register button. Just type in your credentials and a new account will be created for you!").

generate_response(Classification, Person, Action) :-
    nonvar(Classification), nonvar(Person), nonvar(Action),
    Classification == greeting_action,
    Person == user,
    Action == login,
    !,
    write("On the login screen, just type in your credentials you entered when creating a new account. If you want to reset your password, just ask.").

generate_response(Classification, Person, Action) :-
    nonvar(Classification), nonvar(Person), nonvar(Action),
    Classification == greeting_action,
    Person == user,
    Action == reset,
    !,
    write("To reset the password, return to the login page and click on the button 'reset'. You will need to enter your email.").
generate_response(Classification, Person, Action) :-
    nonvar(Classification), nonvar(Action),
    Classification == generate_response,
    Person == user,
    Action == comments,
    !,
    write("I am assuming that you are logged in.\nClick on the post you want to comment. A modal will open up where you can start typing.").



generate_response(Classification, Person, Action) :-
    nonvar(Classification), nonvar(Person), nonvar(Action),
    Classification == greeting_action,
    Person == user,
    Action == help,
    !,
    write("This is the Social-Bot. You can get answers to the functions of the social app.\nEither type in full sentences or use hit words.\nThe hit words which will lead to answers are \n[comment(s), post(s), register, login, again, repeat, or last answer]").

generate_response(Classification, Person, Action) :-
    nonvar(Classification), nonvar(Person), nonvar(Action),
    Classification == question_action,
    Person == user,
    !,
    generate_question_response(Action).

% elpers ***********************************************
generate_question_response(register) :-
    write("To register, please visit the registration page and fill out the required credentials.").

generate_question_response(login) :-

    write("To login, enter your email and password on the login page.").
generate_question_response(post) :-
    write("To create a new post, click on the 'New Post' button on your dashboard.").

generate_question_response(reset) :-
    write("To reset your password, click on the 'Reset Password' link on the login page.").

generate_question_response(comment) :-
    write("To comment on a post, click on the 'Comment' button below the post.").

generate_question_response(_) :-
    write("For general questions on how to use the app, just type 'help'!").

 
% User talks directly to bot
generate_response(Classification, Person, _) :-
    nonvar(Classification), nonvar(Person),
    Classification == greeting_action_adjective,
    Person == bot,
    !,
    write('Hello! I am programmed on logic, so I am not self-thinking.').


generate_response(Classification, _, Action) :-
    nonvar(Classification), nonvar(Action),
    Classification == action_only,
    !,
    write('You want to ~w. How can I assist you further?', [Action]).

% default  ***********************************
generate_response(_, _, _) :-
    write('Please ask me something I could understand.').

