import { resourceModel } from '../model/resource/resource.js';
import { userModel } from '../model/user/user.js';

class ResourceController {
  async createResource(req, res) {
    try {
      const newResource = new resourceModel(req.body);
      await newResource.save();
      res.status(201).json(newResource);
    } catch (error) {
      res.status(400).send(error.message); 
    }
  }

  async getResources(req, res) {
    try {
      const resources = await resourceModel.find().populate('tags');
      res.status(200).json(resources);
    } catch (error) {
      res.status(500).send(error.message); 
    }
  }

  async getReadingList(req, res) {
    try {
      const userId = req.params.userId;
      const user = await userModel.findById(userId).populate('reading_list');
      if (!user) {
        return res.status(404).send('User not found');
      }
      res.status(200).json(user.reading_list);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }  

  async saveResource(req, res) {
    try {
        const userId = req.params.userId;
        const resourceId = req.body.resourceId;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Initialize reading_list if it doesn't exist
        if (!user.reading_list) {
            user.reading_list = [];
        }

        // Add resource to reading_list if not already present
        if (!user.reading_list.includes(resourceId)) {
            user.reading_list.push(resourceId);
            await user.save();
        }

        res.status(200).send('Resource saved to reading list');
    } catch (error) {
        res.status(500).send(error.message);
    }
}


  async unsaveResource(req, res) {
    try {
        const { userId } = req.params;
        const { resourceId } = req.body;
    
        const user = await userModel.findById(userId);
        if (!user) return res.status(404).send('User not found');
    
        user.reading_list = user.reading_list.filter(id => id.toString() !== resourceId);
        await user.save();
    
        res.status(200).send('Resource removed from reading list');
      } catch (error) {
        res.status(500).send(error.message);
      }
  }
}

export default new ResourceController();
