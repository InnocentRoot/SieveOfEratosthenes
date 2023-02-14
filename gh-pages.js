
import { publish } from "gh-pages"

publish(
    'public',
    {
        branch: 'gh-pages',
        repo: 'https://github.com/InnocentRoot/SieveOfEratosthenes', // Update to point to your repository  
        user: {
            name: 'InnocentRoot',
            email: 'innocentroot@gmail.com' // Update to use your email
        }
    },
    (err) => {
        console.log(err)
        console.log('Deploy Complete ! enjoy 🎉🎉 ')
    }
)