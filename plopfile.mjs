import fs from 'fs';

const features = fs.existsSync('src/features') ? fs.readdirSync('src/features', { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name) : [];

export default function (
    /** @type {import('plop').NodePlopAPI} */
    plop
) {
    plop.setGenerator("component", {
        description: "Generate a new React component", // 説明文
        prompts: [
            // プロンプト
            {
                type: 'list',
                name: 'dir',
                message: 'Which directory?',
                choices: ['components', 'features'],
            },
            {
                type: 'list',
                name: 'featureName',
                message: 'Feature name:',
                choices: features.length ?  [...features, { name: 'new feature(create new feature)', value: '' }] : [{ name: 'new feature(create new feature)', value: '' }], // フィーチャーがない場合はNoneを選択
                when: function (answers) {
                    return answers.dir === 'features';
                }
            },
            {
                type: 'input',
                name: 'newFeatureName',
                message: 'new feature dir name:',
                validate: function (value) {
                    // dir 名が空の場合はエラー
                    if (/.+/.test(value)) {
                        return true;
                    }
                    return "new feature dir name is required";
                },
                when: function (answers) {
                    return answers.featureName === '';
                }
            },
            {
                type: 'input',
                name: 'componentName',
                message: 'Component name:',
                validate: function (value) {
                    // コンポーネント名が空の場合はエラー
                    if (/.+/.test(value)) {
                        return true;
                    }
                    return "Component name is required";
                },
            },

        ],
        actions: function (data) {
            const actions = [];
            if(data.dir === 'features' && data.featureName === '') {
                actions.push({
                    type: 'add',
                    path: 'src/features/{{newFeatureName}}/components/{{pascalCase componentName}}/presenter.tsx',
                    templateFile: './plop-templates/components/Component.tsx.hbs'
                })
                actions.push({
                    type: 'add',
                    path: 'src/features/{{newFeatureName}}/components/{{pascalCase componentName}}/index.tsx',
                    templateFile: './plop-templates/components/index.tsx.hbs'
                })
                actions.push({
                    type: 'add',
                    path: 'src/features/{{newFeatureName}}/components/{{pascalCase componentName}}/{{pascalCase componentName}}.stories.tsx',
                    templateFile: './plop-templates/components/newFeature.stories.tsx.hbs'
                })
            }
            if(data.dir === 'features' && data.featureName !== '') {
                actions.push({
                    type: 'add',
                    path: 'src/features/{{featureName}}/components/{{pascalCase componentName}}/presenter.tsx',
                    templateFile: './plop-templates/components/Component.tsx.hbs'
                })
                actions.push({
                    type: 'add',
                    path: 'src/features/{{featureName}}/components/{{pascalCase componentName}}/index.tsx',
                    templateFile: './plop-templates/components/index.tsx.hbs'
                })
                actions.push({
                    type: 'add',
                    path: 'src/features/{{featureName}}/components/{{pascalCase componentName}}/{{pascalCase componentName}}.stories.tsx',
                    templateFile: './plop-templates/components/feature.stories.tsx.hbs'
                })
            }
            if(data.dir === 'components') {
                actions.push({
                    type: 'add',
                    path: 'src/components/{{pascalCase componentName}}/presenter.tsx',
                    templateFile: './plop-templates/components/Component.tsx.hbs'
                })
                actions.push({
                    type: 'add',
                    path: 'src/components/{{pascalCase componentName}}/index.tsx',
                    templateFile: './plop-templates/components/index.tsx.hbs'
                })
                actions.push({
                    type: 'add',
                    path: 'src/components/{{pascalCase componentName}}/{{pascalCase componentName}}.stories.tsx',
                    templateFile: './plop-templates/components/components.stories.tsx.hbs'
                })
            }

            return actions;
        }

    });
}