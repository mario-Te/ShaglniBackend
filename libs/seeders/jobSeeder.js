const mongoose = require('mongoose');
const Job = require('../models');
const Company = require('../models/Company');
const ConnectDb = require("../../db");
async function seedJobs() {
  try {
    // Connect to MongoDB Atlas
    ConnectDb();
    // Get all companies from the database
    const companies = await Company.find();

    // Dummy data for jobs
    const jobs = [
        {
          title: 'Plumber',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce sit amet felis vitae libero placerat ultricies. Integer nec felis at lectus finibus efficitur.',
          tags: ['plumbing', 'repair', 'maintenance'],
          deadline: new Date('2024-04-04'),
          profession: 'Plumber'
        },
        {
          title: 'Barber',
          description: 'Sed ornare nulla nec nisi vehicula, sed scelerisque quam tincidunt. Nulla facilisi. Nam dapibus ex vel libero convallis euismod.',
          tags: ['haircut', 'styling', 'shaving'],
          deadline: new Date('2024-04-06'),
          profession: 'Barber'
        },
        {
          title: 'Blacksmith',
          description: 'Quisque tempus odio id felis varius vehicula. Integer ut nunc eros. In et tincidunt lacus. Fusce sit amet pharetra enim.',
          tags: ['forge', 'metalwork', 'craftsmanship'],
          deadline: new Date('2024-04-08'),
          profession: 'Blacksmith'
        },
        {
          title: 'Wood Maker',
          description: 'Vivamus quis leo a quam laoreet lacinia. Duis auctor libero libero, eu pellentesque nunc suscipit ut. Nam dictum vulputate odio in dapibus.',
          tags: ['woodwork', 'carpentry', 'craftsmanship'],
          deadline: new Date('2024-04-10'),
          profession: 'Wood Maker'
        },
        {
          title: 'Electrician',
          description: 'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Cras vehicula tristique sapien, nec ultricies ex.',
          tags: ['electrical', 'wiring', 'installation'],
          deadline: new Date('2024-04-12'),
          profession: 'Electrician'
        },
        {
          title: 'Painter',
          description: 'Maecenas non purus vel est congue iaculis. Mauris venenatis consequat tincidunt. Fusce vestibulum tortor a augue cursus feugiat.',
          tags: ['painting', 'decorating', 'renovation'],
          deadline: new Date('2024-04-14'),
          profession: 'Painter'
        },
        {
          title: 'Plumber Assistant',
          description: 'Integer nec est at elit vestibulum fringilla ac vel enim. Mauris varius, elit non scelerisque rutrum, justo neque sodales mauris, eget luctus leo sem sit amet arcu.',
          tags: ['plumbing', 'assistant', 'maintenance'],
          company: companies[2],
          deadline: new Date('2024-04-16'),
          profession: 'Plumber'
        },
        {
          title: 'Carpenter',
          description: 'Fusce eu diam nec sapien efficitur vestibulum. Aliquam tincidunt libero sed sollicitudin suscipit. Sed sit amet nisl nec sem faucibus vehicula vel ut ipsum.',
          tags: ['carpentry', 'woodwork', 'construction'],
          deadline: new Date('2024-04-18'),
          profession: 'Wood Maker'
        },
        {
          title: 'Metalworker',
          description: 'Donec malesuada elit a orci dapibus, at vestibulum justo venenatis. Vivamus ullamcorper augue eget efficitur consectetur. Vestibulum eget justo in leo consectetur eleifend.',
          tags: ['metalwork', 'fabrication', 'welding'],
          deadline: new Date('2024-04-20'),
          profession: 'Blacksmith'
        },
        {
          title: 'Hairdresser',
          description: 'Curabitur at pulvinar dui. Proin ac ligula sit amet nisi vestibulum varius. Vivamus nec quam velit. Integer tempor arcu a nisi tempor, at vestibulum metus bibendum.',
          tags: ['haircut', 'styling', 'coloring'],
          deadline: new Date('2024-04-22'),
          profession: 'Barber'
        },
        {
          title: 'HVAC Technician',
          description: 'Morbi quis quam in justo rhoncus vehicula. Integer lobortis velit sed vestibulum viverra. Proin sed libero nec metus blandit ullamcorper. Fusce ac elit at sapien consectetur sagittis.',
          tags: ['hvac', 'ventilation', 'cooling'],
          deadline: new Date('2024-04-24'),
          profession: 'Plumber'
        },
        {
          title: 'Landscape Designer',
          description: 'Vestibulum rutrum neque nec feugiat gravida. Nullam et mauris ac elit vestibulum pellentesque. Sed condimentum nisi id erat mollis, sed aliquet metus facilisis.',
          tags: ['landscaping', 'gardening', 'design'],
          deadline: new Date('2024-04-26'),
          profession: 'Wood Maker'
        },
        {
          title: 'Machinist',
          description: 'Etiam et nisi eu ex venenatis hendrerit. Duis in arcu vel magna vestibulum eleifend. Maecenas vehicula ante at aliquam finibus.',
          tags: ['machining', 'manufacturing', 'metalwork'],
          deadline: new Date('2024-04-28'),
          profession: 'Blacksmith'
        },
        {
          title: 'Plasterer',
          description: 'Nam malesuada ex at turpis tincidunt, in auctor sem accumsan. Curabitur aliquam mi id metus placerat, nec iaculis elit eleifend. Integer bibendum feugiat elit id varius.',
          tags: ['plastering', 'construction', 'repair'],
          deadline: new Date('2024-04-30'),
          profession: 'Wood Maker'
        },
        {
          title: 'Roofer',
          description: 'Praesent eget dui consequat, gravida ex vel, fermentum enim. Sed vestibulum laoreet ligula, sed vehicula ligula facilisis id. Suspendisse pretium sapien eget ex cursus suscipit.',
          tags: ['roofing', 'construction', 'repair'],
          deadline: new Date('2024-05-01'),
          profession: 'Wood Maker'
        }
      
      ];

    // Loop through each job and assign a random company
    for (const jobData of jobs) {
      // Randomly select a company from the companies array
      const randomCompany = companies[Math.floor(Math.random() * companies.length)];

      // Assign the company's ID to the job
      jobData.company = randomCompany._id;

      // Create a new job using the job data
      const newJob = new Job(jobData);

      // Save the job to the database
      await newJob.save();

      console.log('Job seeded successfully:', newJob);
    }

    console.log('All jobs seeded successfully');
  } catch (error) {
    console.error('Error seeding jobs:', error);
  } finally {
    // Close the database connection
    mongoose.disconnect();
  }
}

// Call the function to seed jobs
seedJobs();
