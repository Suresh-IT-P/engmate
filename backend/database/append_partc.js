const fs = require('fs');

const textToAdd = `
### Expansion of Proverbs

### 1. A Bad Workman Always Blames His Tools

The meaning of this proverb is that our success does not depend on what kind of tools we have but how we use them. Here is a story to elucidate the meaning.

Raj and Ravi were farmers. They owned a pair of oxen each with which they ploughed their lands. Raj put in hard work while Ravi hardly worked. Raj worked all day long, aimed at getting a good yield and took good care of his oxen, fully understanding their needs. Ravi, on the other hand, was very lazy and miserly. He never fed his oxen well but exploited them to the maximum.

As a true friend, Raj advised Ravi and sometimes even admonished him for his treatment of the animals. Ravi paid little heed to Raj’s words. He soon bought a tractor to plough his land and chased the oxen away. Raj brought home the animals and took care of them too though he could not afford it. The monsoon soon arrived and it was time for cultivation. Raj’s land was well-ploughed and ready for cultivation-thanks to his oxen.

Ravi in his miserly fashion had not maintained his tractor well and it kept giving him trouble. As a result, he could not get his field ready for cultivation on time. He lamented and blamed it all on bad luck not realizing that it was he who was responsible for his miserable state. Ravi not only lost out on a good yield because of his laziness, but also spent a huge sum of money to repair his tractor due to poor maintenance. Despite having better equipment Ravi was unable to get the best results. But, Raj was a good workman and hence was able to succeed with the limited resources he had.

**IT IS NEVER TOO LATE TO MEND**

### 2. Actions Speak Louder Than Words

The proverb ‘Actions speak louder than words’ means “If we want to help somebody, it must be through action giving money or things not simply by empty words. A friend in need is a friend indeed”. Let us see the meaning of this proverb in the following story.

A small town was hit by famine, because of lack of adequate rain. People were suffering. There was no enough rice for hundreds of people. The Church Father knelt down and prayed to god for them: 'God almighty, help these poor people. Save them from famine' and so many other touching words. In his granary there were hundred sacks of rice.

A rich man who had a few sacks of rice invited all the towns’ people to his house and distributed rice to them free of cost. Then he went to the church Father and said to him, 'Good morning Father. Please excuse me father. You are praying for the poor people - it is good. But if you take rice from your granary and give it to the poor people, it will be better.' The Father realised the truth and opened his granary to the poor. So, actions speak better than words.

**BARE WORDS BUY NO BARLEY**

### 3. Despair Gives Courage to a Coward

Despair gives courage to a coward means “Even a coward will act bravely in a hopeless, dangerous situation.” The following story reveals this proverb.

Ganesh was a ten-year old boy. He was a coward, he was afraid of many things. All his friends climbed up the trees, jumped from branch to branch, plucked fruits and flowers. Thus they enjoyed themselves. But Ganesh went near a tree. He always said, “If I climb up a tree, I may fall down and die”. His friends encouraged him, but in vain.

One day Edwin was walking across the field. A bull saw him and began to chase him. He ran faster and faster, but the bull also ran faster after him. Suddenly he saw a tree. He jumped on to the tree, put his arms around the trunk of the tree, moving up with great difficulty and strain, he reached the first branch and sat on it. The bull went away.

In a minute, all his friends came there “Hi, Ganesh!” “What a surprise!” Ganesh jumped down and narrated the whole event. Then his friends exclaimed: “Despair gives courage even to a coward.”

**COURAGE CONQUERS ALL THINGS**
`;

let data = JSON.parse(fs.readFileSync('d:/self/backend/database/data/new_part4_content.json', 'utf8'));
data.lesson_writing += textToAdd;
fs.writeFileSync('d:/self/backend/database/data/new_part4_content.json', JSON.stringify(data, null, 2));
console.log('Successfully added Part C (Expansion of Proverbs) to new_part4_content.json');
