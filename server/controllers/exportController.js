const archiver = require('archiver');
const Client = require('../models/Client');
const Design = require('../models/Design');
const { createGeneratedProjectFiles } = require('../utils/generatedProjectFiles');

const exportClientZip = async (req, res, next) => {
  try {
    const { clientId } = req.params;
    const client = await Client.findOne({ clientId }).lean();
    const design = await Design.findOne({ clientId }).sort({ createdAt: -1 }).lean();

    if (!client || !design) {
      return res.status(404).json({ message: 'Client or design not found for export' });
    }

    if (!client.isActive) {
      return res.status(403).json({ message: 'This client ID is disabled. Activate it before export.' });
    }

    if (!['approved', 'deployed'].includes(design.status)) {
      return res.status(400).json({ message: 'Only approved requests can be exported.' });
    }

    const files = createGeneratedProjectFiles({ client, design });
    const archive = archiver('zip', { zlib: { level: 9 } });

    archive.on('error', (archiveError) => {
      throw archiveError;
    });

    res.attachment(`${clientId}-frontend.zip`);
    archive.pipe(res);

    files.forEach((file) => {
      archive.append(file.content, { name: file.name });
    });

    await archive.finalize();
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  exportClientZip
};
