const Contact = require('../models/contact.model');

/**
 * Get contact messages with search, filter & pagination
 * GET /api/v1/admin/messages
 */
const getMessages = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.status && req.query.status !== 'all') {
      filter.status = req.query.status;
    }

    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
        { subject: { $regex: req.query.search, $options: 'i' } },
        { message: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const [messages, total] = await Promise.all([
      Contact.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Contact.countDocuments(filter),
    ]);

    const unreadCount = await Contact.countDocuments({ status: 'unread' });

    return res.status(200).json({
      success: true,
      data: messages,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      unreadCount,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update message status (mark read/unread)
 * PUT /api/v1/admin/messages/:id/status
 */
const updateMessageStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['read', 'unread', 'archived'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value. Must be read, unread, or archived.',
      });
    }

    const message = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: `Message marked as ${status}.`,
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete contact message
 * DELETE /api/v1/admin/messages/:id
 */
const deleteMessage = async (req, res, next) => {
  try {
    const message = await Contact.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found.',
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Message deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMessages,
  updateMessageStatus,
  deleteMessage,
};
